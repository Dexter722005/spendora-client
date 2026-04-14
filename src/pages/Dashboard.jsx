import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import TransactionForm from "../components/TransactionForm";
import Charts from "../components/Charts";
import TransactionList from "../components/TransactionList";
import BudgetManager from "../components/BudgetManager";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [insights, setInsights] = useState({});
  const [budgets, setBudgets] = useState([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setError("");
      const res = await API.get("/transactions");
      setData(res.data);

      const ins = await API.get("/insights");
      setInsights(ins.data);

      const bud = await API.get("/budgets");
      setBudgets(bud.data);
    } catch (err) {
      console.error("Error fetching data", err);
      setError("Unable to fetch dashboard data. Please check your connection.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportCSV = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = data.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description || "N/A",
      t.category,
      t.type,
      t.amount
    ]);

    const csvContent = [headers, ...rows]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Spendora_Report_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ FILTER
  const filteredData = data.filter(t =>
    t.category?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 md:p-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Financial Overview</h1>
            <p className="text-gray-500 dark:text-gray-400">Track your spending and stay on top of your budget.</p>
          </div>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-xl shadow transition active:scale-95"
          >
            📤 Export CSV
          </button>
        </div>

        {/* 🔥 TOP CARDS (UPGRADED) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* ... existing cards ... */}

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center space-x-4 transition-colors">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl text-2xl">💸</div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Expense</p>
              <p className="text-2xl font-bold dark:text-gray-100">
                ₹{insights.totalExpense?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center space-x-4 transition-colors">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl text-2xl">💰</div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Income</p>
              <p className="text-2xl font-bold dark:text-gray-100">
                ₹{insights.totalIncome?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center space-x-4 transition-colors">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-2xl">📊</div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
              <p className="text-2xl font-bold dark:text-gray-100">
                ₹{insights.balance?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center space-x-4 transition-colors">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl text-2xl">🔮</div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Prediction</p>
              <p className="text-2xl font-bold dark:text-gray-100">
                ₹{insights.prediction?.toLocaleString() || 0}
              </p>
            </div>
          </div>

        </div>

        {/* 🧠 SMART INSIGHTS */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow mb-6 border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-2 dark:text-gray-100">Smart Insights</h2>
          {insights.insights?.length > 0 ? (
            insights.insights.map((msg, i) => (
              <p key={i} className="text-yellow-600 dark:text-yellow-400">• {msg}</p>
            ))
          ) : (
            <p className="text-gray-400">No insights yet</p>
          )}
        </div>

        {/* 🎯 GOAL TRACKER */}
        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl mb-6">
          <p className="font-semibold dark:text-blue-300">
            Goal: ₹10,000 | Saved: ₹{insights.balance || 0}
          </p>
        </div>

        {/* 💸 BUDGET MANAGER */}
        <div className="mb-8">
          <BudgetManager 
            budgets={budgets} 
            transactions={data} 
            refresh={fetchData} 
          />
        </div>

        {/* 🔍 FILTER */}
        <input
          type="text"
          placeholder="Filter by category (e.g. food)"
          className="border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 p-2 my-4 w-full rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
          onChange={(e) => setFilter(e.target.value)}
        />

        {/* FORM + CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Add Transaction</h2>
            <TransactionForm refresh={fetchData} />
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Spending Analysis</h2>
            {filteredData.length > 0 ? (
              <Charts data={filteredData} />
            ) : (
              <p className="text-gray-400">No data</p>
            )}
          </div>

        </div>

        {/* 🧾 TRANSACTION HISTORY */}
        <TransactionList data={filteredData} />

      </main>
    </div>
  );
}