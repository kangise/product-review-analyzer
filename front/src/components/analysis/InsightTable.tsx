import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronRight, MessageSquare, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { QuoteModal } from './QuoteModal';
import { InsightTableProps, TableColumn } from '../../types/analysis';

export const InsightTable: React.FC<InsightTableProps> = ({
  title,
  data,
  columns,
  expandable = false,
  quotable = false,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [quoteModal, setQuoteModal] = useState<{
    isOpen: boolean;
    quotes: string[];
    title: string;
  }>({
    isOpen: false,
    quotes: [],
    title: '',
  });

  const toggleRowExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const showQuotes = (quotes: string[], itemTitle: string) => {
    setQuoteModal({
      isOpen: true,
      quotes,
      title: itemTitle,
    });
  };

  const renderCellContent = (item: any, column: TableColumn) => {
    const value = item[column.key];

    switch (column.type) {
      case 'percentage':
        return (
          <div className="flex items-center gap-system-sm">
            <Progress 
              value={value} 
              className="flex-1 h-2" 
            />
            <span className="text-sm font-medium min-w-[3rem]">
              {value}%
            </span>
          </div>
        );

      case 'progress':
        return (
          <Progress 
            value={value} 
            className="w-full h-2" 
          />
        );

      case 'badge':
        const badgeVariant = value > 70 ? 'default' : value > 40 ? 'secondary' : 'outline';
        return (
          <Badge variant={badgeVariant}>
            {value}
          </Badge>
        );

      case 'number':
        return (
          <span className="font-mono text-sm">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
        );

      default:
        return (
          <span className="text-sm">
            {value}
          </span>
        );
    }
  };

  return (
    <>
      <Card className="border-clean shadow-clean">
        <CardHeader className="spacing-system-md">
          <CardTitle className="text-lg font-semibold">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="spacing-system-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {expandable && <th className="w-8"></th>}
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`text-left spacing-system-sm text-sm font-medium text-muted-foreground ${
                        column.width || ''
                      }`}
                    >
                      {column.label}
                    </th>
                  ))}
                  {quotable && <th className="w-16"></th>}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      {expandable && (
                        <td className="spacing-system-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowExpansion(index)}
                            className="w-6 h-6 p-0"
                          >
                            <motion.div
                              animate={{ rotate: expandedRows.has(index) ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight className="w-3 h-3" />
                            </motion.div>
                          </Button>
                        </td>
                      )}
                      {columns.map((column) => (
                        <td key={column.key} className="spacing-system-sm">
                          {renderCellContent(item, column)}
                        </td>
                      ))}
                      {quotable && item.quotes && (
                        <td className="spacing-system-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => showQuotes(item.quotes, item[columns[0].key])}
                            className="w-8 h-8 p-0"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                        </td>
                      )}
                    </tr>
                    
                    {expandable && expandedRows.has(index) && item.details && (
                      <tr>
                        <td colSpan={columns.length + (expandable ? 1 : 0) + (quotable ? 1 : 0)}>
                          <AnimatePresence>
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="spacing-system-md bg-muted/30 rounded-md m-2">
                                <div className="text-sm text-muted-foreground">
                                  {item.details}
                                </div>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <QuoteModal
        isOpen={quoteModal.isOpen}
        onClose={() => setQuoteModal(prev => ({ ...prev, isOpen: false }))}
        quotes={quoteModal.quotes}
        title={quoteModal.title}
      />
    </>
  );
};
