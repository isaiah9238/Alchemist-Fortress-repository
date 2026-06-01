
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
import { WandSparkles, Loader2 } from 'lucide-react';
import { type CalculateIntegralInput, type CalculateIntegralOutput } from '@/types/ai';
import { calculateIntegral } from '@/app/actions';

export default function IntegralClientPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [expression, setExpression] = useState('x^2 + 3*x');
  const [variable, setVariable] = useState('x');
  const [lowerBound, setLowerBound] = useState('');
  const [upperBound, setUpperBound] = useState('');
  const [result, setResult] = useState<CalculateIntegralOutput | null>(null);

  const handleCalculate = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const input: CalculateIntegralInput = {
        expression,
        variable,
      };
      if (lowerBound) input.lowerBound = lowerBound;
      if (upperBound) input.upperBound = upperBound;

      const aiResult = await calculateIntegral(input);
      setResult(aiResult);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Calculation Failed',
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
          <CardTitle>Expression Input</CardTitle>
          <CardDescription>
             Enter the expression to integrate. Leave bounds empty for an indefinite integral.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expression">Expression</Label>
            <Input
              id="expression"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g., 4*x^3 - x"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="variable">Variable</Label>
            <Input
              id="variable"
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              placeholder="e.g., x"
              className="w-24"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="lower-bound">Lower Bound (Optional)</Label>
                <Input
                id="lower-bound"
                value={lowerBound}
                onChange={(e) => setLowerBound(e.target.value)}
                placeholder="e.g., 0"
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="upper-bound">Upper Bound (Optional)</Label>
                <Input
                id="upper-bound"
                value={upperBound}
                onChange={(e) => setUpperBound(e.target.value)}
                placeholder="e.g., 10"
                />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCalculate} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles className="mr-2 h-4 w-4" />}
            Calculate Integral
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Result</CardTitle>
          <CardDescription>The calculated integral will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center rounded-md border border-dashed p-8">
              <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">AI is calculating...</p>
            </div>
          )}
          {result ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Integral:</span>
                <span className="font-mono text-primary font-bold">{result.integral}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Simplified:</span>
                <span className="font-mono text-primary font-bold">{result.simplified}</span>
              </div>
              {result.value !== undefined && (
                <>
                <Separator/>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Numerical Value:</span>
                    <span className="font-mono text-primary font-bold">{result.value.toFixed(6)}</span>
                </div>
                </>
              )}
              <Separator />
               <div className="flex flex-col items-start gap-2">
                <span className="text-muted-foreground">LaTeX Representation:</span>
                <code className="font-mono text-sm bg-muted p-2 rounded-md">{result.latex}</code>
              </div>
            </div>
          ) : (
            !isLoading && <div className="flex h-48 items-center justify-center text-muted-foreground">
              <p>Enter an expression and click "Calculate".</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
