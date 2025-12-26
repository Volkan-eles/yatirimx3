import React, { useState } from 'react';

interface FAQItemProps {
    question: string;
    answer: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-blue-500/30">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-6 text-left group"
            >
                <span className="text-zinc-200 font-bold text-sm group-hover:text-white transition-colors flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${isOpen ? 'bg-blue-500 text-white border-blue-500' : 'bg-zinc-800 border-white/5 text-zinc-500 group-hover:bg-zinc-700'}`}>
                        ?
                    </span>
                    {question}
                </span>
                {isOpen ? <div className="text-blue-500">-</div> : <div className="text-zinc-500">+</div>}
            </button>
            <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
                <div className="overflow-hidden">
                    <div className="p-6 pt-0 text-zinc-400 text-sm leading-relaxed border-t border-white/5 mt-2">
                        {answer}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQItem;
