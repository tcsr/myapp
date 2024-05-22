<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="background-container">
        <div class="left-background"></div>
        <div class="right-background"></div>
    </div>
    <div class="container">
        <div class="login-box">
            <h1>eInvoice</h1>
            <form>
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">LOGIN</button>
                <a href="#">Forgot Password?</a>
                <div class="separator-container">
                    <div class="separator-line"></div>
                    <div class="separator-circle">OR</div>
                    <div class="separator-line"></div>
                </div>
                <button type="button" class="sso-button">LOGIN WITH SSO</button>
            </form>
            <div class="footer">
                <a href="#">Terms & Conditions</a> - <a href="#">Privacy Policy</a>
            </div>
            <div class="powered-by">
                <span>Powered by</span>
                <img src="logo.png" alt="Logo">
            </div>
        </div>
    </div>
</body>
</html>

==========================

body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow: hidden;
}

.background-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    z-index: -1;
}

.left-background, .right-background {
    width: 50%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
}

.left-background {
    background: url('login-left-img.png') no-repeat center;
    left: -10%;
}

.right-background {
    background: url('login-right-img.png') no-repeat center;
    right: -10%;
}

.container {
    background: linear-gradient(to bottom right, rgba(50, 168, 82, 0.8), rgba(60, 200, 128, 0.8));
    border-radius: 8px;
    padding: 40px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    text-align: center;
    z-index: 1;
}

.login-box {
    background-color: #ffffff;
    padding: 40px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
    width: 100%;
    max-width: 400px;
    z-index: 2;
}

.login-box h1 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
}

.login-box input[type="text"],
.login-box input[type="password"] {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.login-box button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    border: none;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.login-box button:hover {
    background-color: #0056b3;
}

.login-box a {
    display: block;
    margin-top: 10px;
    color: #007bff;
    text-decoration: none;
}

.login-box a:hover {
    text-decoration: underline;
}

.login-box .sso-button {
    background-color: #ffffff;
    color: #007bff;
    border: 2px solid #007bff;
    margin-top: 10px;
}

.login-box .sso-button:hover {
    background-color: #f5f5f5;
}

.login-box .footer {
    margin-top: 20px;
    font-size: 12px;
    color: #777;
}

.login-box .footer a {
    color: #777;
    text-decoration: none;
}

.login-box .footer a:hover {
    text-decoration: underline;
}

.login-box .powered-by {
    margin-top: 30px;
}

.separator {
    margin: 20px 0;
    font-size: 14px;
    color: #777;
}

.separator-container {
    display: flex;
    align-items: center;
    margin: 20px 0;
}

.separator-line {
    flex: 1;
    height: 1px;
    background-color: #ddd;
}

.separator-circle {
    width: 40px;
    height: 40px;
	border: 1px solid #777;
    border-radius: 50%;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #777;
    font-size: 14px;
    margin: 0 10px;
}
