export default function TransactionList({ data }) {
  return (
    <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-800 transition-colors">
      <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Transaction History</h2>

      <div className="space-y-1">
        {data.map((t) => (
          <div key={t._id} className="flex justify-between border-b border-gray-100 dark:border-gray-800 py-3 last:border-0">
            <div>
              <p className="font-medium dark:text-gray-200 capitalize">
                {t.category} - <span className="text-gray-500 dark:text-gray-400 font-normal">{t.description || "No description"}</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(t.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </p>
            </div>

            <p className={
              t.type === "expense"
                ? "text-red-500 dark:text-red-400 font-bold"
                : "text-green-500 dark:text-green-400 font-bold"
            }>
              {t.type === "expense" ? "-" : "+"} ₹{t.amount.toLocaleString()}
            </p>
          </div>
        ))}

        {data.length === 0 && (
          <p className="text-center text-gray-400 py-4">No transactions found.</p>
        )}
      </div>
    </div>
  );
}