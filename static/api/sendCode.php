<?php
session_start();
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';



use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $code = rand(100000, 999999);

    // Save the confirmation code in the session
    $_SESSION['email_confirmation'] = ['email' => $email, 'code' => $code];

    // Send email using PHPMailer
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com'; // Replace with your SMTP host
        $mail->SMTPAuth   = true;
        $mail->Username   = 'kosupure94@gmail.com'; // Replace with your email
        $mail->Password   = 'fujiwara000'; // Replace with your email password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 465;

        $mail->setFrom('kosupure94@gmail.com', 'Kosupure');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = 'Email Confirmation Code';
        $mail->Body    = "Your confirmation code is: <strong>$code</strong>";

        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Code sent successfully']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $mail->ErrorInfo]);
    }
}
?>
