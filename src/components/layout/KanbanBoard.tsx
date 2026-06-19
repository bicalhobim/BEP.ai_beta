import React from 'react';
import { useBEPStore, Milestone } from '../../store/bepStore';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'motion/react';
import { Calendar, Clock, CheckCircle2, Circle, GripVertical } from 'lucide-react';
import clsx from 'clsx';

interface KanbanCardProps {
  milestone: Milestone;
}

function KanbanCard({ milestone }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: milestone.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "bg-white p-4 rounded-lg border shadow-sm mb-3 group transition-all",
        isDragging ? "border-orange-400 shadow-lg ring-2 ring-orange-100" : "border-slate-200 hover:border-orange-200"
      )}
    >
      <div className="flex items-start gap-3">
        <div 
          {...attributes} 
          {...listeners}
          className="mt-1 p-1 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing rounded hover:bg-slate-50"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
              {milestone.item || 'S/N'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {milestone.duration}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-slate-800 mb-2 line-clamp-2">
            {milestone.description || 'Sem descrição'}
          </h4>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{milestone.start || '--'}</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{milestone.end || '--'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  id: string;
  title: string;
  milestones: Milestone[];
  icon: React.ReactNode;
  colorClass: string;
}

function KanbanColumn({ id, title, milestones, icon, colorClass }: KanbanColumnProps) {
  return (
    <div className="flex flex-col w-80 bg-slate-100/50 rounded-xl border border-slate-200 h-full max-h-full">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white/50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className={clsx("p-1.5 rounded-lg", colorClass)}>
            {icon}
          </div>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{title}</h3>
        </div>
        <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {milestones.length}
        </span>
      </div>
      <div className="flex-1 p-3 overflow-y-auto">
        <SortableContext 
          items={milestones.map(m => m.id)}
          strategy={verticalListSortingStrategy}
        >
          {milestones.map((m) => (
            <KanbanCard key={m.id} milestone={m} />
          ))}
          {milestones.length === 0 && (
            <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center">
              <p className="text-xs text-slate-400 italic">Nenhum marco aqui</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const { blocks, updateBlockContent } = useBEPStore();
  const scheduleBlock = blocks.find(b => b.type === 'schedule');
  const milestones: Milestone[] = scheduleBlock?.content.milestones || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns = [
    { 
      id: 'todo', 
      title: 'A Fazer', 
      icon: <Circle className="w-4 h-4 text-slate-500" />,
      colorClass: 'bg-slate-100',
      milestones: milestones.filter(m => m.status === 'todo' || !m.status)
    },
    { 
      id: 'in_progress', 
      title: 'Em Progresso', 
      icon: <Clock className="w-4 h-4 text-orange-600" />,
      colorClass: 'bg-orange-100',
      milestones: milestones.filter(m => m.status === 'in_progress')
    },
    { 
      id: 'done', 
      title: 'Concluído', 
      icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
      colorClass: 'bg-green-100',
      milestones: milestones.filter(m => m.status === 'done')
    }
  ];

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find if we dropped over a column or a card
    const activeMilestone = milestones.find(m => m.id === activeId);
    if (!activeMilestone) return;

    // Check if overId is a column ID
    const columnIds = ['todo', 'in_progress', 'done'];
    if (columnIds.includes(overId)) {
      if (activeMilestone.status !== overId) {
        const newMilestones = milestones.map(m => 
          m.id === activeId ? { ...m, status: overId as any } : m
        );
        updateBlockContent(scheduleBlock!.id, { milestones: newMilestones });
      }
      return;
    }

    // If over a card, find its column
    const overMilestone = milestones.find(m => m.id === overId);
    if (overMilestone && activeMilestone.status !== overMilestone.status) {
      const newMilestones = milestones.map(m => 
        m.id === activeId ? { ...m, status: overMilestone.status } : m
      );
      updateBlockContent(scheduleBlock!.id, { milestones: newMilestones });
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Gerenciamento de Marcos</h2>
        <p className="text-slate-500 text-sm">Organize e acompanhe o progresso dos marcos do projeto em estilo Kanban.</p>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-h-[500px]">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {columns.map(col => (
              <KanbanColumn 
                key={col.id} 
                id={col.id}
                title={col.title}
                icon={col.icon}
                colorClass={col.colorClass}
                milestones={col.milestones}
              />
            ))}
          </DndContext>
        </div>
      </div>
    </div>
  );
}
