
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WandSparkles, Loader2 } from 'lucide-react';
import { suggestToleranceStandard } from '@/app/actions';
import type { SuggestToleranceStandardInput, SuggestToleranceStandardOutput } from '@/types/ai';

const surveyTypes = ['Boundary', 'Control', 'Topographic', 'Construction'];
const terrainTypes = ['Urban', 'Suburban', 'Rural', 'Mountainous'];

export default function StandardsClientPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [surveyType, setSurveyType] = useState('Boundary');
  const [terrain, setTerrain] = useState('Urban');
  const [accuracy, setAccuracy] = useState('');

  const [result, setResult] = useState<SuggestToleranceStandardOutput | null>(null);

  const handleSuggest = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const input: SuggestToleranceStandardInput = { surveyType, terrain };
      if (accuracy) {
        input.accuracyRequirements = accuracy;
      }
      const aiResult = await suggestToleranceStandard(input);
      setResult(aiResult);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Suggestion Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Provide details about your survey to get a recommended tolerance standard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="survey-type">Type of Survey</Label>
            <Select value={surveyType} onValueChange={setSurveyType}>
                <SelectTrigger id="survey-type"><SelectValue/></SelectTrigger>
                <SelectContent>
                    {surveyTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label htmlFor="terrain">Terrain</Label>
            <Select value={terrain} onValueChange={setTerrain}>
                <SelectTrigger id="terrain"><SelectValue/></SelectTrigger>
                <SelectContent>
                    {terrainTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label htmlFor="accuracy">Specific Requirements (Optional)</Label>
            <Input id="accuracy" value={accuracy} onChange={e => setAccuracy(e.target.value)} placeholder="e.g., ALTA/NSPS survey" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSuggest} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles className="mr-2 h-4 w-4" />}
            Suggest Standard
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendation</CardTitle>
          <CardDescription>The suggested standard will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center rounded-md border border-dashed p-8">
              <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">AI is thinking...</p>
            </div>
          )}
          {result ? (
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-primary">{result.standardName}</h3>
                    <p className="text-sm text-muted-foreground">{result.description}</p>
                </div>
                <Separator/>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Recommended Tolerance:</span>
                    <span className="font-mono text-lg font-bold text-primary">{result.toleranceValue}</span>
                </div>
                <Separator/>
                <div>
                    <h4 className="font-semibold text-sm">Justification</h4>
                    <p className="text-sm mt-1">{result.justification}</p>
                </div>
            </div>
          ) : (
            !isLoading && <div className="flex h-48 items-center justify-center text-muted-foreground">
              <p>Enter project details and click "Suggest".</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
