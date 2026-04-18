interface AcceptanceModalProps {
  isOpen: boolean;
  completedCount: number;
  totalCount: number;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
}

export default function AcceptanceModal({ isOpen, completedCount, totalCount, onAccept, onReject, onClose }: AcceptanceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-[400px] border border-gray-700 shadow-xl">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">任务验收</h3>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">验收意见</label>
            <textarea 
              className="w-full bg-gray-800 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
              rows={4} 
              placeholder="请输入验收意见..." 
            />
          </div>
          <div className="text-sm text-gray-500 mb-4">验收进度: {completedCount}/{totalCount} 已完成</div>
        </div>
        <div className="p-4 border-t border-gray-700 flex gap-3">
          <button onClick={onAccept} className="flex-1 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700">✅ 通过</button>
          <button onClick={onReject} className="flex-1 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700">❌ 驳回</button>
        </div>
      </div>
    </div>
  );
}