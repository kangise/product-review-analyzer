import React from 'react';
import { X, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { QuoteModalProps } from '../../types/analysis';

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  quotes,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[80vh] mx-4"
        >
          <Card className="border-clean shadow-clean-lg">
            <CardHeader className="spacing-system-lg border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-system-sm">
                  <Quote className="w-5 h-5 text-primary" />
                  Customer Quotes: {title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-system-sm">
                <Badge variant="secondary">
                  {quotes.length} quotes
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="spacing-system-lg">
              <div className="max-h-96 overflow-y-auto">
                <div className="gap-system-md flex flex-col">
                  {quotes.map((quote, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative"
                    >
                      <div className="bg-muted/30 rounded-lg spacing-system-md border-l-4 border-primary/30">
                        <div className="flex items-start gap-system-sm">
                          <Quote className="w-4 h-4 text-primary/60 mt-1 flex-shrink-0" />
                          <p className="text-sm leading-relaxed text-foreground">
                            "{quote}"
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
