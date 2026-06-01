
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
import { type CalculateDerivativeInput, type CalculateDerivativeOutput } from '@/types/ai';
import { calculateDerivative } from '@/app/actions';

export default function DerivativeClientPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [expression, setExpression] = useState('x^3 + 2*x^2 - 5*x + 1');
  const [variable, setVariable] = useState('x');
  const [result, setResult] = useState<CalculateDerivativeOutput | null>(null);

  const handleCalculate = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const input: CalculateDerivativeInput = {
        expression,
        variable,
      };
      const aiResult = await calculateDerivative(input);
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
            Enter the mathematical expression to differentiate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expression">Expression</Label>
            <Input
              id="expression"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g., 3*x^2 + sin(x)"
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
        </CardContent>
        <CardFooter>
          <Button onClick={handleCalculate} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles className="mr-2 h-4 w-4" />}
            Calculate Derivative
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Result</CardTitle>
          <CardDescription>The calculated derivative will appear here.</CardDescription>
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
                <span className="text-muted-foreground">Derivative:</span>
                <span className="font-mono text-primary font-bold">{result.derivative}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Simplified:</span>
                <span className="font-mono text-primary font-bold">{result.simplified}</span>
              </div>
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
