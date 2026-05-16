import React, { useState, useEffect, useMemo } from 'react';
import { products } from './data';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { Calculator, Save, History, Plus, Minus, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';

type Quantities = Record<string, number>;

type SavedCalculation = {
  id: string;
  name: string;
  date: string;
  quantities: Quantities;
  total: number;
};

export default function App() {
  const [quantities, setQuantities] = useState<Quantities>({});
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [view, setView] = useState<'calculator' | 'saved'>('calculator');
  const [saveName, setSaveName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Load saved calculations on mount
  useEffect(() => {
    const saved = localStorage.getItem('clothingCalculations');
    if (saved) {
      try {
        setSavedCalculations(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved calculations', e);
      }
    }
  }, []);

  // Compute totals
  const totalItems = useMemo(() => {
    return Object.values(quantities).reduce((acc, q) => acc + (q || 0), 0);
  }, [quantities]);

  const totalPrice = useMemo(() => {
    return products.reduce((acc, product) => {
      const q = quantities[product.id] || 0;
      return acc + q * product.price;
    }, 0);
  }, [quantities]);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      const newQuantities = { ...prev };
      if (next === 0) {
        delete newQuantities[id];
      } else {
        newQuantities[id] = next;
      }
      return newQuantities;
    });
  };

  const handleSave = () => {
    if (!saveName.trim() || totalItems === 0) return;

    const newSaved: SavedCalculation = {
      id: uuidv4(),
      name: saveName.trim(),
      date: new Date().toISOString(),
      quantities,
      total: totalPrice,
    };

    const updated = [newSaved, ...savedCalculations];
    setSavedCalculations(updated);
    localStorage.setItem('clothingCalculations', JSON.stringify(updated));
    
    setSaveName('');
    setShowSaveDialog(false);
    setQuantities({});
  };

  const loadCalculation = (calc: SavedCalculation) => {
    setQuantities(calc.quantities);
    setView('calculator');
  };

  const deleteCalculation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedCalculations.filter((c) => c.id !== id);
    setSavedCalculations(updated);
    localStorage.setItem('clothingCalculations', JSON.stringify(updated));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const groupedProducts = useMemo(() => {
    const groups: Record<string, typeof products> = {};
    products.forEach((p) => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8FAFC] text-slate-800 antialiased font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
            CalcModa <span className="text-indigo-600 text-sm font-normal">Pro Order</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView(view === 'calculator' ? 'saved' : 'calculator')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              view === 'saved' ? 'text-indigo-600 bg-indigo-50 rounded-lg' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {view === 'calculator' ? (
              <>
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Histórico Recente</span>
                <span className="sm:hidden">Salvos</span>
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar à Calculadora</span>
                <span className="sm:hidden">Voltar</span>
              </>
            )}
          </button>
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <span className="hidden sm:inline text-xs text-slate-400 font-mono">APP V1.0</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto md:overflow-hidden p-4 md:p-6">
        {view === 'calculator' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
            <div className="md:col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 content-start md:overflow-y-auto pb-6 pr-1">
              {Object.entries(groupedProducts).map(([category, items], index) => (
                <section key={category} className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col gap-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                    {index + 1}. {category}
                  </h3>
                  <div className="space-y-2">
                    {items.map((product) => {
                      const q = quantities[product.id] || 0;
                      return (
                        <div key={product.id} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors -mx-2 px-2 rounded">
                          <div className="flex flex-col flex-1 pr-2">
                            <span className="text-sm font-medium text-slate-800 leading-tight">{product.name}</span>
                            <span className="text-xs text-slate-400 mt-0.5">{formatCurrency(product.price)}</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200 shrink-0">
                              <button
                                onClick={() => updateQuantity(product.id, -1)}
                                disabled={q === 0}
                                className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm disabled:opacity-50 disabled:hover:bg-transparent transition-all"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center font-medium text-sm text-slate-900 select-none">
                                {q}
                              </span>
                              <button
                                onClick={() => updateQuantity(product.id, 1)}
                                className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <aside className="md:col-span-12 lg:col-span-4 flex flex-col gap-6 md:overflow-y-auto pb-6">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">Resumo do Pedido</h2>
                  {totalItems > 0 && (
                    <button
                      onClick={() => setQuantities({})}
                      className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="text-sm">Total de Itens</span>
                    <span className="font-mono font-medium">{totalItems}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-y border-slate-100">
                    <div className="flex flex-col w-full">
                      <span className="text-xs text-slate-400 uppercase font-bold tracking-tighter mb-1">Total Final</span>
                      <span className="text-3xl font-black text-slate-900 text-right w-full">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-indigo-900">Entrada (50%)</span>
                      <span className="text-lg font-bold text-indigo-600">{formatCurrency(totalPrice / 2)}</span>
                    </div>
                    <p className="text-[10px] text-indigo-400 mt-1 uppercase">Valor sugerido para início da produção</p>
                  </div>
                </div>
                
                <div className="mt-2 flex flex-col gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nome do Pedido / Cliente</label>
                    <input
                      type="text"
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                      }}
                      placeholder="Ex: Turma 3A - Evento Setembro"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={!saveName.trim() || totalItems === 0}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-slate-900/10"
                  >
                    <Save className="w-5 h-5" /> Salvar Cálculo
                  </button>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 shrink-0">
                <div className="w-10 h-10 bg-amber-200/50 rounded-full flex items-center justify-center shrink-0 text-amber-700">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed pt-0.5">Seus cálculos ficam salvos automaticamente neste navegador. Não é necessário criar conta.</p>
              </div>
            </aside>
          </div>
        )}

        {view === 'saved' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Histórico de Cálculos</h1>
            </div>

            {savedCalculations.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 border-dashed">
                <History className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-900">Nenhum cálculo salvo</p>
                <p className="text-slate-500 mt-1">Seus orçamentos salvos aparecerão aqui.</p>
                <button
                  onClick={() => setView('calculator')}
                  className="mt-6 text-indigo-600 font-medium hover:text-indigo-700 px-4 py-2 bg-indigo-50 rounded-lg transition-colors"
                >
                  Criar um novo pedido &rarr;
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {savedCalculations.map((calc) => (
                  <div
                    key={calc.id}
                    onClick={() => loadCalculation(calc)}
                    className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[160px]"
                  >
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {calc.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1.5 font-mono">
                          {format(new Date(calc.date), "dd/MM/yyyy • HH:mm")}
                        </p>
                      </div>
                      <button
                        onClick={(e) => deleteCalculation(calc.id, e)}
                        className="text-slate-300 hover:text-red-600 p-1.5 -mr-1.5 -mt-1.5 rounded hover:bg-red-50 transition opacity-0 group-hover:opacity-100 sm:opacity-100"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="flex justify-between text-xs text-slate-500 font-medium uppercase tracking-wider">
                        <span>{Object.values(calc.quantities).reduce((a, b) => a + b, 0)} Itens</span>
                        <span>Total Final</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-bold text-indigo-600">
                          {formatCurrency(calc.total / 2)} <span className="text-[10px] font-normal uppercase text-indigo-400">Entrada</span>
                        </span>
                        <span className="text-xl font-black text-slate-900">
                          {formatCurrency(calc.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
