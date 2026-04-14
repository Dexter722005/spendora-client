import { useState } from "react";
import API from "../services/api";

export default function TransactionForm({ refresh }) {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
    description: ""
  });

  // 🔥 AUTO CATEGORIZATION
  const autoCategorize = (desc) => {
    const text = desc.toLowerCase();

    if (text.includes("uber") || text.includes("ola")) return "transport";
    if (text.includes("zomato") || text.includes("swiggy")) return "food";
    if (text.includes("salary")) return "income";
    if (text.includes("rent")) return "rent";

    return form.category; // fallback
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ FIX: ensure number + normalized category
      const finalCategory = form.category
        ? form.category.toLowerCase()
        : autoCategorize(form.description);

      const payload = {
        ...form,
        amount: Number(form.amount),
        category: finalCategory || "other"
      };

      await API.post("/transactions", payload);

      // reset form
      setForm({
        amount: "",
        category: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
        description: ""
      });

      refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding transaction. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* AMOUNT */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Amount (₹)
        </label>
        <input
          type="number"
          placeholder="0.00"
          className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
          value={form.amount}
          required
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />
      </div>

      {/* CATEGORY */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <input
          placeholder="e.g. food, rent, salary"
          className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />
      </div>

      {/* DESCRIPTION (NEW + IMPORTANT) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <input
          placeholder="e.g. Zomato order, Uber ride"
          className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </div>

      {/* TYPE */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Type
        </label>
        <select
          className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg p-3 bg-white transition-colors"
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      {/* DATE */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Date
        </label>
        <input
          type="date"
          className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
          value={form.date}
          required
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />
      </div>

      {/* BUTTON */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow transition active:scale-95">
        Add Transaction
      </button>

    </form>
  );
}