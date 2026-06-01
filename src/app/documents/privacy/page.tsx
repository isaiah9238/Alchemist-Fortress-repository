
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Privacy Policy"
        description="Last updated: July 26, 2024"
      />
      <Card>
        <CardContent className="pt-6">
            <div className="space-y-6 text-sm text-muted-foreground">
                <p>
                    Your privacy is important to us. This Privacy Policy explains how ArithmaGen ("we," "us," or "our")
                    collects, uses, and protects your information when you use our web application.
                </p>

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">Information We Collect</h3>
                    <p>
                        We collect the following types of information to provide and improve our service:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>
                            <strong>Account Information:</strong> When you sign up, we collect your email address and a securely hashed
                            version of your password. This information is used solely for authentication and to secure your account.
                        </li>
                        <li>
                            <strong>User-Generated Data:</strong> We store the data you create and save within the application, such as
                            the bearings and distances for traverse loops, coordinates for calculations, and other inputs you provide
                            to our various toolkit features. This data is associated with your user account to allow you to access and
                            manage it across sessions.
                        </li>
                        <li>
                            <strong>AI-Powered Calculations:</strong> For features that use generative AI (such as the calculus solvers and least squares adjustment), the mathematical expressions and survey data you input are sent to our AI service provider, Google, to generate a solution. We use Google's Gemini models via enterprise-grade APIs that are designed not to use your data to train their global models.
                        </li>
                    </ul>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">How We Use Your Information</h3>
                    <p>
                        The information we collect is used for the following purposes:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>To provide, operate, and maintain our application.</li>
                        <li>To allow you to create and manage your account.</li>
                        <li>To save your work (like traverse loops and other calculations) so you can access it later.</li>
                        <li>To improve our application and develop new features.</li>
                    </ul>
                    <p>
                        We do not share, sell, or rent your personal information or user-generated data with third parties for marketing purposes.
                    </p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">Cookies and Tracking Technologies</h3>
                    <p>
                        We use cookies and similar technologies for essential application functionality. A cookie is a small text file stored on your device.
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>
                            <strong>Authentication:</strong> We use cookies to keep you signed in to your account. Without these, you would have to log in on every page. These are managed by Firebase Authentication.
                        </li>
                        <li>
                            <strong>Theme Preferences:</strong> We use a cookie to remember your preferred theme (light, dark, or system) between visits.
                        </li>
                    </ul>
                    <p>
                        We do not use cookies for advertising, marketing, or cross-site tracking. The cookies we use are strictly for providing and improving your experience within the ArithmaGen application.
                    </p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">Data Security</h3>
                    <p>
                        We use Firebase, a platform developed by Google, to power our application. Your data is stored securely within
                        Firebase's infrastructure. We rely on Firebase's robust security measures, including path-based security rules,
                        to ensure that only you can access your own data.
                    </p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">Account Deletion</h3>
                    <p>
                        You may request the deletion of your account and all associated data at any time. To do so, please contact us through the Comments & Feedback page with your request.
                    </p>
                    <p>
                        Upon receiving your request, we will permanently delete your authentication record and all user-generated content associated with your account from our database, including any saved traverse loops, functions, or other calculations. This action is irreversible.
                    </p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">Changes to This Privacy Policy</h3>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
                        Privacy Policy on this page.
                    </p>
                </div>
                
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">Contact Us</h3>
                    <p>
                        If you have any questions about this Privacy Policy, please feel free to reach out via the Comments & Feedback page.
                    </p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
