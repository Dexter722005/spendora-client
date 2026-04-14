import { useState } from "react";
import API from "../services/api";

export default function BudgetManager({ budgets, transactions, refresh }) {
  const [form, setForm] = useState({ category: "", limitAmount: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/budgets", {
        ...form,
        limitAmount: Number(form.limitAmount),
        month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
      });
      setForm({ category: "", limitAmount: "" });
      refresh();
    } catch (err) {
      alert("Failed to set budget. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ADD BUDGET FORM */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-800 transition-colors">
        <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Set Monthly Budget</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <input
            placeholder="Category (e.g. food)"
            className="flex-1 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={form.category}
            required
            onChange={(e) => setForm({ ...form, category: e.target.value.toLowerCase() })}
          />
          <input
            type="number"
            placeholder="Limit Amount (₹)"
            className="flex-1 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={form.limitAmount}
            required
            onChange={(e) => setForm({ ...form, limitAmount: e.target.value })}
          />
          <button 
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-lg shadow transition active:scale-95 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Set Budget"}
          </button>
        </form>
      </div>

      {/* BUDGET LIST & PROGRESS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.length > 0 ? budgets.map((b) => {
          const spent = transactions
            .filter(t => t.category === b.category && t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);
          
          const percent = Math.min((spent / b.limitAmount) * 100, 100);
          const isOver = spent >= b.limitAmount;
          const isNear = spent >= 0.8 * b.limitAmount;

          return (
            <div key={b._id} className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-700 dark:text-gray-200 capitalize">{b.category}</span>
                <span className="text-sm font-medium dark:text-gray-400">
                  ₹{spent.toLocaleString()} / ₹{b.limitAmount.toLocaleString()}
                </span>
              </div>
              
              {/* PROGRESS BAR */}
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    isOver ? 'bg-red-500' : isNear ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between items-center">
                <p className={`text-xs font-bold ${isOver ? 'text-red-500' : isNear ? 'text-yellow-500' : 'text-green-500'}`}>
                  {isOver ? "Over Budget!" : isNear ? "Nearing Limit" : "On Track"}
                </p>
                <p className="text-xs text-gray-400">{Math.round(percent)}% used</p>
              </div>
            </div>
          );
        }) : (
          <div className="md:col-span-2 text-center py-10 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No budgets set for this month. Start by adding one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
