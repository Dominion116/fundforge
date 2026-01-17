import Link from "next/link";
import { formatEther } from "viem";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Target } from "lucide-react";
import { CampaignData } from "@/hooks/useCampaigns";

interface CampaignCardProps {
  campaign: CampaignData;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  // Calculate percentage raised
  // If goal is 0 (shouldn't happen), avoid division by zero
  const percentage = campaign.goal > 0n 
    ? Number((campaign.totalContributed * 100n) / campaign.goal) 
    : 0;
  
  // Cap at 100% for visual purposes if you want, or let it overflow to show success
  const displayPercentage = Math.min(percentage, 100);

  // Status mapping
  const getStatusBadge = (state: number) => {
    switch (state) {
        case 0: return <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/20 border-primary/50">Active</Badge>;
        case 1: return <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-500 border-emerald-500/50">Successful</Badge>;
        case 2: return <Badge variant="destructive" className="bg-destructive/20 text-destructive border-destructive/50">Failed</Badge>;
        default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="flex flex-col h-full bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors group">
      <CardHeader className="p-6 pb-4">
        <div className="flex justify-between items-start gap-4 mb-2">
          {getStatusBadge(campaign.state)}
          {percentage >= 100 && (
             <Badge variant="outline" className="border-emerald-500/50 text-emerald-500">Funded</Badge>
          )}
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {campaign.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {campaign.description}
        </p>
      </CardHeader>
      
      <CardContent className="p-6 py-2 flex-grow">
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">
                        {formatEther(campaign.totalContributed)} ETH
                    </span>
                    <span className="text-muted-foreground">
                        of {formatEther(campaign.goal)} ETH
                    </span>
                </div>
                <Progress value={displayPercentage} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <Target className="size-4" />
                    <span>{percentage}% funded</span>
                </div>
                 <div className="flex items-center gap-1.5">
                    <CalendarIcon className="size-4" />
                    <span>
                        {new Date(Number(campaign.deadline) * 1000).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-4">
        <Button className="w-full" asChild>
            <Link href={`/campaign/${campaign.address}`}>
                View Details
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
