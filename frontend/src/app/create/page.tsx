'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseEther } from 'viem';
import { useCreateCampaign } from '@/hooks/useCreateCampaign';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import { format } from 'date-fns';
import { CalendarIcon, Loader2, Plus, Trash2, Rocket, Flag, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Milestone {
  description: string;
  amount: string;
}

export default function CreateCampaignPage() {
  const router = useRouter();
  const { createCampaign, isPending, isSuccess } = useCreateCampaign();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  
  // Milestones State
  const [milestones, setMilestones] = useState<Milestone[]>([
    { description: 'Initial Setup & Development', amount: '' }
  ]);

  // Validation & Helpers
  const addMilestone = () => {
    setMilestones([...milestones, { description: '', amount: '' }]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setMilestones(newMilestones);
  };

  const calculateTotalMilestones = () => {
    return milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !goal || !deadline) {
        toast.error("Please fill in all required fields.");
        return;
    }

    const totalMilestoneAmount = calculateTotalMilestones();
    const goalAmount = parseFloat(goal);

    if (Math.abs(totalMilestoneAmount - goalAmount) > 0.000001) {
        toast.error(`Milestone amounts (${totalMilestoneAmount} ETH) must equal the funding goal (${goalAmount} ETH).`);
        return;
    }

    const durationInSeconds = Math.floor((deadline.getTime() - Date.now()) / 1000);
    
    if (durationInSeconds <= 0) {
        toast.error("Deadline must be in the future.");
        return;
    }

    // Convert to BigInt for contract
    try {
        const goalWei = parseEther(goal);
        const milestoneAmountsWei = milestones.map(m => parseEther(m.amount));
        const milestoneDescriptions = milestones.map(m => m.description);
        
        await createCampaign(
            title,
            description,
            goalWei,
            BigInt(durationInSeconds),
            milestoneDescriptions,
            milestoneAmountsWei
        );
        
    } catch (error) {
        console.error("Submission error:", error);
    }
  };

  // Redirect on success
  if (isSuccess) {
    // Ideally we'd wait a bit or show a success screen, then redirect
    setTimeout(() => {
        router.push('/explore');
    }, 2000);
  }

  return (
    <div className="container mx-auto px-6 py-20 max-w-3xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tighter mb-4">
            Launch Your Campaign
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Create a transparent, milestone-based crowdfunding campaign. 
          Define your goals, set your milestones, and build trust with your contributors from day one.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Basic Information */}
        <Card className="bg-card/40 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Flag className="size-5 text-primary" />
                    Project Details
                </CardTitle>
                <CardDescription>The core information about your crowdfunding campaign.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Project Title <span className="text-red-500">*</span></Label>
                    <Input 
                        id="title" 
                        placeholder="e.g. Decentralized File Storage" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-background/50"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                    <Textarea 
                        id="description" 
                        placeholder="Explain your project, its mission, and how funds will be used..." 
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-background/50 resize-none"
                    />
                </div>
            </CardContent>
        </Card>

        {/* 2. Funding & Timeline */}
        <Card className="bg-card/40 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="size-5 text-primary" />
                    Funding & Timeline
                </CardTitle>
                <CardDescription>Set your financial goals and campaign duration.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                 <div className="space-y-2">
                    <Label htmlFor="goal">Funding Goal (ETH) <span className="text-red-500">*</span></Label>
                    <div className="relative">
                        <Input 
                            id="goal" 
                            type="number" 
                            step="0.001" 
                            min="0"
                            placeholder="0.00" 
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                             className="bg-background/50 pl-8"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">Ξ</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Campaign Deadline <span className="text-red-500">*</span></Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal bg-background/50",
                                    !deadline && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={deadline}
                                onSelect={setDeadline}
                                initialFocus
                                disabled={(date) => date < new Date()}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </CardContent>
        </Card>

        {/* 3. Milestones */}
        <Card className="bg-card/40 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="size-5 text-primary" />
                    Milestones
                </CardTitle>
                <CardDescription>
                    Break down your project into deliverable milestones. Funds are released only when milestones are approved by contributors.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-secondary/20 p-4 rounded-lg border border-border/50 mb-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-muted-foreground">Total Goal: {goal || '0'} ETH</span>
                        <span className={cn(
                            "font-bold",
                            Math.abs(calculateTotalMilestones() - (parseFloat(goal) || 0)) < 0.000001 ? "text-emerald-500" : "text-amber-500"
                        )}>
                            Allocated: {calculateTotalMilestones()} ETH
                        </span>
                    </div>
                </div>

                {milestones.map((milestone, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 items-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 w-full">
                             <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Milestone {index + 1} Description</Label>
                                <Input 
                                    placeholder="What will you deliver?" 
                                    value={milestone.description}
                                    onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                                    className="bg-background/50"
                                />
                             </div>
                             <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Amount (ETH)</Label>
                                <Input 
                                    type="number" 
                                    step="0.001"
                                    min="0"
                                    placeholder="0.00"
                                    value={milestone.amount}
                                    onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                                    className="bg-background/50"
                                />
                             </div>
                        </div>
                        <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive shrink-0 mb-0.5"
                            onClick={() => removeMilestone(index)}
                            disabled={milestones.length === 1}
                        >
                            <Trash2 className="size-5" />
                        </Button>
                    </div>
                ))}
            </CardContent>
            <div className="p-6 pt-0">
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addMilestone}
                    className="w-full border-dashed border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
                >
                    <Plus className="mr-2 size-4" />
                    Add Milestone
                </Button>
            </div>
        </Card>

        {/* Submit Action */}
        <div className="pt-6 flex justify-end">
            <Button size="lg" disabled={isPending} className="w-full md:w-auto px-8 text-lg font-semibold">
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 size-5 animate-spin" />
                        Creating Campaign...
                    </>
                ) : (
                    <>
                        Deploy Contract
                    </>
                )}
            </Button>
        </div>
      </form>
    </div>
  );
}
