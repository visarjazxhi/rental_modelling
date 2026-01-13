'use client';

/**
 * Scenario Manager Component
 * 
 * Provides UI for saving, loading, and managing scenarios.
 */

import { useState } from 'react';
import { 
  Save, 
  FolderOpen, 
  Trash2, 
  Copy, 
  Edit2, 
  Check, 
  X,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { SavedScenario } from '@/app/lib/hooks/use-scenarios';
import type { PropertyModelInputs } from '@/app/lib/types';

interface ScenarioManagerProps {
  scenarios: SavedScenario[];
  currentInputs: PropertyModelInputs;
  onSave: (name: string) => void;
  onLoad: (scenario: SavedScenario) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function ScenarioManager({
  scenarios,
  currentInputs,
  onSave,
  onLoad,
  onDelete,
  onDuplicate,
  onRename,
}: ScenarioManagerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');

  const handleSave = () => {
    if (newName.trim()) {
      onSave(newName.trim());
      setNewName('');
    }
  };

  const handleLoadSelected = () => {
    const scenario = scenarios.find(s => s.id === selectedScenarioId);
    if (scenario) {
      onLoad(scenario);
    }
  };

  const handleStartEdit = (scenario: SavedScenario) => {
    setEditingId(scenario.id);
    setEditingName(scenario.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      onRename(editingId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-sm text-slate-700">Scenarios</span>
          {scenarios.length > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
              {scenarios.length}
            </span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-slate-100 p-3 space-y-4">
          {/* Quick load */}
          <div className="flex gap-2">
            <Select value={selectedScenarioId} onValueChange={setSelectedScenarioId}>
              <SelectTrigger className="flex-1 h-9 text-sm">
                <SelectValue placeholder="Select scenario to load..." />
              </SelectTrigger>
              <SelectContent>
                {scenarios.length === 0 ? (
                  <SelectItem value="none" disabled>No saved scenarios</SelectItem>
                ) : (
                  scenarios.map(scenario => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      {scenario.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoadSelected}
                    disabled={!selectedScenarioId}
                    className="h-9"
                  >
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Load selected scenario</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Save new */}
          <div className="flex gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New scenario name..."
              className="h-9 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSave}
                    disabled={!newName.trim()}
                    className="h-9 bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save current as new scenario</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Saved scenarios list */}
          {scenarios.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Saved Scenarios
              </p>
              {scenarios.map(scenario => (
                <div
                  key={scenario.id}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded-lg group"
                >
                  <div className="flex-1 min-w-0">
                    {editingId === scenario.id ? (
                      <div className="flex items-center gap-1">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-7 text-sm"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSaveEdit}
                          className="h-7 w-7 p-0"
                        >
                          <Check className="h-3 w-3 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelEdit}
                          className="h-7 w-7 p-0"
                        >
                          <X className="h-3 w-3 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {scenario.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatDate(scenario.updatedAt)}
                        </p>
                      </>
                    )}
                  </div>
                  
                  {editingId !== scenario.id && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onLoad(scenario)}
                              className="h-7 w-7 p-0"
                            >
                              <FolderOpen className="h-3.5 w-3.5 text-blue-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Load</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartEdit(scenario)}
                              className="h-7 w-7 p-0"
                            >
                              <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Rename</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDuplicate(scenario.id)}
                              className="h-7 w-7 p-0"
                            >
                              <Copy className="h-3.5 w-3.5 text-slate-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Duplicate</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(scenario.id)}
                              className="h-7 w-7 p-0"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ScenarioManager;
