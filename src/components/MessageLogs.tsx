import { useState } from 'react';
import { X, Edit, Trash2, History, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/types/chat';

interface MessageLogsProps {
  open: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  canViewDeleted: boolean;
}

export function MessageLogs({ open, onClose, messages, canViewDeleted }: MessageLogsProps) {
  // Filter messages that have edit history or are deleted (if user has permission)
  const loggedMessages = messages.filter(m => 
    (m.editHistory && m.editHistory.length > 0) || 
    (m.deleted && canViewDeleted)
  );

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <History className="w-4 h-4" />
            Message Logs
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4 pt-2">
          <p className="text-xs text-muted-foreground mb-3">
            View edit and deletion history for messages
          </p>

          <ScrollArea className="h-80">
            {loggedMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No message history to display
              </div>
            ) : (
              <div className="space-y-4">
                {loggedMessages.map(msg => (
                  <div key={msg.id} className="border border-border rounded-lg p-3">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{msg.username}</span>
                        {msg.deleted && (
                          <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Trash2 className="w-3 h-3" />
                            Deleted
                          </span>
                        )}
                        {msg.editHistory && msg.editHistory.length > 0 && (
                          <span className="text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Edit className="w-3 h-3" />
                            {msg.editHistory.length} edit{msg.editHistory.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>

                    {/* Original message */}
                    {msg.originalText && (
                      <div className="mb-2">
                        <span className="text-[10px] text-muted-foreground">Original:</span>
                        <p className="text-sm text-muted-foreground line-through">
                          {msg.originalText}
                        </p>
                      </div>
                    )}

                    {/* Current text (if not deleted) */}
                    {!msg.deleted && msg.text && (
                      <div className="mb-2">
                        <span className="text-[10px] text-muted-foreground">Current:</span>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    )}

                    {/* Deleted info */}
                    {msg.deleted && msg.deletedBy && (
                      <div className="text-xs text-muted-foreground mb-2">
                        Deleted by <span className="font-medium">{msg.deletedBy}</span>
                        {msg.deletedAt && ` at ${formatTime(msg.deletedAt)}`}
                      </div>
                    )}

                    {/* Edit history */}
                    {msg.editHistory && msg.editHistory.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 mb-2">
                          <Clock className="w-3 h-3" />
                          Edit History
                        </span>
                        <div className="space-y-2">
                          {msg.editHistory.map((edit, idx) => (
                            <div key={idx} className="bg-secondary/50 rounded p-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] text-muted-foreground">
                                  {formatTime(edit.editedAt)}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  by {edit.editedBy}
                                </span>
                              </div>
                              <p className="text-xs">{edit.previousText}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Image */}
                    {msg.imageUrl && !msg.deleted && (
                      <img 
                        src={msg.imageUrl} 
                        alt="Shared" 
                        className="max-w-full h-auto rounded mt-2 max-h-32 object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}