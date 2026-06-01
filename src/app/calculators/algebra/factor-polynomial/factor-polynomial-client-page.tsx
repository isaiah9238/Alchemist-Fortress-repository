
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
import { type FactorPolynomialInput, type FactorPolynomialOutput } from '@/types/ai';
import { factorPolynomial } from '@/app/actions';

export default function FactorPolynomialClientPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [expression, setExpression] = useState('x^2 - 4');
  const [result, setResult] = useState<FactorPolynomialOutput | null>(null);

  const handleCalculate = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const input: FactorPolynomialInput = {
        expression,
      };
      const aiResult = await factorPolynomial(input);
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
          <CardTitle>Polynomial Input</CardTitle>
           <CardDescription>
             Enter the polynomial to factor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expression">Expression</Label>
            <Input
              id="expression"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g., x^3 - 2x^2 - x + 2"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCalculate} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles className="mr-2 h-4 w-4" />}
            Factor Polynomial
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Result</CardTitle>
          <CardDescription>The factored form and roots will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center rounded-md border border-dashed p-8">
              <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">AI is factoring...</p>
            </div>
          )}
          {result ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Factored Form:</span>
                <span className="font-mono text-primary font-bold">{result.factored}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Roots:</span>
                <span className="font-mono text-primary font-bold">{result.roots.join(', ')}</span>
              </div>
              <Separator />
               <div className="flex flex-col items-start gap-2">
                <span className="text-muted-foreground">LaTeX Representation:</span>
                <code className="font-mono text-sm bg-muted p-2 rounded-md">{result.latex}</code>
              </div>
            </div>
          ) : (
            !isLoading && <div className="flex h-48 items-center justify-center text-muted-foreground">
              <p>Enter a polynomial and click "Factor".</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
