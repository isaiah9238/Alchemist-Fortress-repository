
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Terms of Service"
        description="Last updated: July 29, 2024"
      />
      <Card>
        <CardContent className="pt-6">
            <div className="space-y-6 text-sm text-muted-foreground">
                <p>
                    Welcome to ArithmaGen. These Terms of Service ("Terms") govern your use of our web application
                    (the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
                </p>

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">1. Use of the Service</h3>
                    <p>
                        ArithmaGen is provided for educational and informational purposes only. You agree to use the Service
                        in compliance with all applicable laws and not for any unlawful purpose.
                    </p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">2. Disclaimer of Warranties</h3>
                    <p>
                        The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied,
                        regarding the accuracy, reliability, or completeness of any calculations or information provided by the Service.
                        All calculations, including but not limited to, surveying, engineering, and mathematical results, should be
                        independently verified by a licensed professional. Your use of the Service is at your own risk.
                    </p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">3. Limitation of Liability</h3>
                    <p>
                        In no event shall ArithmaGen or its creators be liable for any direct, indirect, incidental, special,
                        consequential, or exemplary damages, including but not limited to, damages for loss of profits, data,
                        or other intangible losses, resulting from the use or the inability to use the Service. You agree that
                        you are solely responsible for any decisions made based on the output of the Service.
                    </p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">4. User Accounts</h3>
                    <p>
                        You are responsible for safeguarding your account information, including your password. You agree to
                        notify us immediately of any unauthorized use of your account. We are not liable for any loss or damage
                        arising from your failure to comply with this security obligation.
                    </p>
                </div>
                
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">5. Intellectual Property</h3>
                    <p>
                        The Service and its original content, features, and functionality are and will remain the exclusive property
                        of the project creators. Your data, such as the loops and functions you create, remains your own.
                    </p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">6. Changes to Terms</h3>
                    <p>
                        We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new
                        Terms of Service on this page. Your continued use of the Service after any such changes constitutes your
                        acceptance of the new Terms.
                    </p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">7. Contact Us</h3>
                    <p>
                        If you have any questions about these Terms, please contact us through the Comments & Feedback page.
                    </p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
