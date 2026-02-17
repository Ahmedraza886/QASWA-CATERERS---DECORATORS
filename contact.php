<?php
// contact.php - Contact Form Handler for Qaswa Caterers & Decorators
// Updated to use PHPMailer with Gmail

// PHPMailer namespace declarations MUST come before everything else
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer via Composer
require 'vendor/autoload.php';
// If NOT using Composer, comment the line above and uncomment these 3 lines:
// require 'PHPMailer/src/Exception.php';
// require 'PHPMailer/src/PHPMailer.php';
// require 'PHPMailer/src/SMTP.php';

// Error reporting - set display_errors to 1 temporarily to debug, then set back to 0 in production
error_reporting(E_ALL);
ini_set('display_errors', 1); // ← Change to 0 once working
ini_set('log_errors', 1);

// Enable CORS if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// ============================================
// GMAIL CONFIGURATION - UPDATE THESE VALUES
// ============================================
$smtp_host      = "smtp.gmail.com";
$smtp_port      = 587; // 587 for TLS (STARTTLS), 465 for SSL
$smtp_username  = "qaswacateringservices@gmail.com"; // Your Gmail address
$smtp_password  = "xxxx xxxx xxxx xxxx"; // ← REPLACE with your 16-character Gmail App Password
                                          //   Get it at: myaccount.google.com → Security → App Passwords
                                          //   (2-Step Verification must be ON first)
$recipient_email = "qaswacateringservices@gmail.com"; // Where to receive form submissions
$from_email     = "qaswacateringservices@gmail.com";  // Must match $smtp_username for Gmail
$from_name      = "Qaswa Caterers Website";

// Redirect URLs — note: success uses ?, error also uses ? (not &)
$redirect_success = "contact.html?status=success";
$redirect_error   = "contact.html?status=error";

// ============================================
// HELPER FUNCTIONS
// ============================================

// Sanitize input — NOTE: we do NOT use htmlspecialchars here because
// we apply it selectively inside the HTML email body below to avoid double-encoding
function clean_input($data) {
    return trim(stripslashes($data));
}

function is_valid_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// ============================================
// MAIN FORM HANDLER
// ============================================
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Collect and sanitize form data
    $name       = isset($_POST['name'])       ? clean_input($_POST['name'])       : '';
    $email      = isset($_POST['email'])      ? clean_input($_POST['email'])      : '';
    $phone      = isset($_POST['phone'])      ? clean_input($_POST['phone'])      : '';
    $event_type = isset($_POST['event-type']) ? clean_input($_POST['event-type']) : '';
    $date       = isset($_POST['date'])       ? clean_input($_POST['date'])       : '';
    $guests     = isset($_POST['guests'])     ? clean_input($_POST['guests'])     : '';
    $message    = isset($_POST['message'])    ? clean_input($_POST['message'])    : '';

    // Validation
    $errors = [];

    if (empty($name)) {
        $errors[] = "Name is required";
    }
    if (empty($email)) {
        $errors[] = "Email is required";
    } elseif (!is_valid_email($email)) {
        $errors[] = "Invalid email format";
    }
    if (empty($event_type)) {
        $errors[] = "Event type is required";
    }
    if (empty($message)) {
        $errors[] = "Message is required";
    }

    // Redirect back if validation failed
    if (!empty($errors)) {
        $error_message = implode(", ", $errors);
        header("Location: contact.html?status=validation&message=" . urlencode($error_message));
        exit;
    }

    // Escape values for safe use inside HTML email body
    $safe_name       = htmlspecialchars($name,       ENT_QUOTES, 'UTF-8');
    $safe_email      = htmlspecialchars($email,      ENT_QUOTES, 'UTF-8');
    $safe_phone      = htmlspecialchars($phone,      ENT_QUOTES, 'UTF-8');
    $safe_event_type = htmlspecialchars($event_type, ENT_QUOTES, 'UTF-8');
    $safe_date       = htmlspecialchars($date,       ENT_QUOTES, 'UTF-8');
    $safe_guests     = htmlspecialchars($guests,     ENT_QUOTES, 'UTF-8');
    $safe_message    = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

    // ---- HTML Email Body ----
    $email_body = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #d4af37; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .field { margin-bottom: 15px; }
            .field-label { font-weight: bold; color: #d4af37; }
            .field-value { margin-top: 5px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #888; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Contact Form Submission</h2>
                <p>Qaswa Caterers &amp; Decorators</p>
            </div>
            <div class='content'>
                <div class='field'>
                    <div class='field-label'>Name:</div>
                    <div class='field-value'>$safe_name</div>
                </div>
                <div class='field'>
                    <div class='field-label'>Email:</div>
                    <div class='field-value'>$safe_email</div>
                </div>
                <div class='field'>
                    <div class='field-label'>Phone:</div>
                    <div class='field-value'>" . ($safe_phone ? $safe_phone : 'Not provided') . "</div>
                </div>
                <div class='field'>
                    <div class='field-label'>Event Type:</div>
                    <div class='field-value'>$safe_event_type</div>
                </div>
                <div class='field'>
                    <div class='field-label'>Preferred Date:</div>
                    <div class='field-value'>" . ($safe_date ? $safe_date : 'Not specified') . "</div>
                </div>
                <div class='field'>
                    <div class='field-label'>Number of Guests:</div>
                    <div class='field-value'>" . ($safe_guests ? $safe_guests : 'Not specified') . "</div>
                </div>
                <div class='field'>
                    <div class='field-label'>Message:</div>
                    <div class='field-value'>$safe_message</div>
                </div>
            </div>
            <div class='footer'>
                <p>Submitted on: " . date('F j, Y \a\t g:i A') . "</p>
            </div>
        </div>
    </body>
    </html>
    ";

    // ---- Plain Text Fallback ----
    $email_text  = "New Contact Form Submission\n\n";
    $email_text .= "================================\n\n";
    $email_text .= "Name: $name\n";
    $email_text .= "Email: $email\n";
    $email_text .= "Phone: " . ($phone ? $phone : 'Not provided') . "\n";
    $email_text .= "Event Type: $event_type\n";
    $email_text .= "Preferred Date: " . ($date ? $date : 'Not specified') . "\n";
    $email_text .= "Number of Guests: " . ($guests ? $guests : 'Not specified') . "\n\n";
    $email_text .= "Message:\n$message\n\n";
    $email_text .= "================================\n";
    $email_text .= "Submitted on: " . date('F j, Y \a\t g:i A') . "\n";

    // ---- Send via PHPMailer ----
    $mail = new PHPMailer(true);

    try {
        // SMTP Server settings
        $mail->isSMTP();
        $mail->Host       = $smtp_host;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtp_username;
        $mail->Password   = $smtp_password;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Use ENCRYPTION_SMTPS for port 465
        $mail->Port       = $smtp_port;

        // Recipients
        $mail->setFrom($from_email, $from_name);
        $mail->addAddress($recipient_email);
        $mail->addReplyTo($email, $name); // Replies go to the customer

        // Email content
        $mail->isHTML(true);
        $mail->Subject = "New Contact Form - $event_type Event - $name";
        $mail->Body    = $email_body;
        $mail->AltBody = $email_text;

        $mail->send();

        // Success
        header("Location: $redirect_success");
        exit;

    } catch (Exception $e) {
        error_log("Contact form error: {$mail->ErrorInfo}");
        // Redirect to error page — use ? not & as the first query separator
        header("Location: $redirect_error&debug=" . urlencode($mail->ErrorInfo));
        exit;
    }

} else {
    // Direct access without POST → redirect to contact page
    header("Location: contact.html");
    exit;
}
?>