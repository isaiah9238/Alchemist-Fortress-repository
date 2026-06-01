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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useMemoFirebase, useCollection, useUser } from '@/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type Comment = {
  id: string;
  userId: string;
  userEmail: string;
  text: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

export default function CommentsClientPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commentsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'comments');
  }, [firestore]);

  const commentsQuery = useMemoFirebase(() => {
    if (!commentsCollection) return null;
    return query(commentsCollection, orderBy('createdAt', 'desc'));
  }, [commentsCollection]);

  const { data: comments, isLoading: isLoadingComments } = useCollection<Comment>(commentsQuery);

  const handlePostComment = async () => {
    if (!firestore || !commentsCollection || !user) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to comment.' });
      return;
    }
    if (!newComment.trim()) {
      toast({ variant: 'destructive', title: 'Validation Error', description: 'Comment cannot be empty.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(commentsCollection, {
        text: newComment,
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
      });
      setNewComment('');
      toast({ title: 'Success', description: 'Your comment has been posted.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not post comment. ' + error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Leave Feedback</CardTitle>
            <CardDescription>{ user ? "Share your thoughts, suggestions, or issues." : "You must be logged in to leave feedback."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user ? "What's on your mind?" : "Please log in to comment."}
              rows={4}
              disabled={!user || isSubmitting}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handlePostComment} disabled={!user || isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
              Post Comment
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Comments</h2>
        {isLoadingComments && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        )}
        {comments && comments.length > 0 ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {comments.map((comment) => (
              <Card key={comment.id} className="p-4">
                <p className="text-sm">{comment.text}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                  <p className="text-xs text-muted-foreground font-medium">
                    {comment.userEmail || 'Anonymous'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt.seconds * 1000), { addSuffix: true }) : 'just now'}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          !isLoadingComments && (
            <p className="text-muted-foreground">No comments yet. Be the first to leave feedback!</p>
          )
        )}
      </div>
    </div>
  );
}
