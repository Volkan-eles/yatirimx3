import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors relative overflow-hidden"
            title={theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'dark' ? 0 : 180,
                    scale: theme === 'dark' ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <Moon className="w-5 h-5 text-blue-400" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'dark' ? -180 : 0,
                    scale: theme === 'dark' ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <Sun className="w-5 h-5 text-yellow-500" />
            </motion.div>

            {/* Spacer for button size */}
            <div className="w-5 h-5 opacity-0">
                <Sun className="w-5 h-5" />
            </div>
        </motion.button>
    );
};

export default ThemeToggle;
