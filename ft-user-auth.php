/**
 * FootballTalento - WordPress Backend Functions
 * Updated with YOUR Brand Colors (#045694, #0a84ff, #eef2fb)
 * Add this code to your theme's functions.php or create a custom plugin
 */

// FootballTalento Security Configuration
if (!defined('FT_API_KEY')) {
    define('FT_API_KEY', 'ft_secure_8822_primary_key');
}

// CORS Support
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-FT-API-Key');
        return $value;
    });
});

/**
 * Validate API Key helper
 */
if (!function_exists('ft_validate_api_key')) {
    function ft_validate_api_key($request) {
        $api_key = $request->get_header('X-FT-API-Key');
        if ($api_key === FT_API_KEY) {
            return true;
        }
        return new WP_Error('rest_unauthorized', 'Invalid API Key', array('status' => 401));
    }
}

/**
 * Rate Limiting helper
 */
if (!function_exists('ft_check_rate_limit')) {
    function ft_check_rate_limit($action = 'default', $limit = 5, $duration = 3600) {
        $ip = $_SERVER['REMOTE_ADDR'];
        $transient_key = 'ft_rate_limit_' . $action . '_' . md5($ip);
        $attempts = get_transient($transient_key);
        
        if ($attempts === false) {
            set_transient($transient_key, 1, $duration);
            return true;
        }
        
        if ($attempts >= $limit) {
            return false;
        }
        
        set_transient($transient_key, $attempts + 1, $duration);
        return true;
    }
}

/**
 * Custom User Registration Endpoint
 */
add_action('rest_api_init', function() {
    register_rest_route('footballtalento/v1', '/register', array(
        'methods' => 'POST',
        'callback' => 'ft_register_user',
        'permission_callback' => 'ft_validate_api_key'
    ));
});

if (!function_exists('ft_register_user')) {
    function ft_register_user($request) {
        $params = $request->get_json_params();
    
    // Honeypot check
    if (!empty($params['website_url'])) {
        return new WP_Error('honeypot_caught', 'Bot detected', array('status' => 403));
    }
    
    // Rate limit signup: 3 attempts per hour
    if (!ft_check_rate_limit('signup', 3, 3600)) {
        return new WP_Error('rate_limit', 'Too many registration attempts. Please try again after an hour.', array('status' => 429));
    }
    
    // Validate required fields
    $required_fields = ['fullName', 'email', 'password', 'accountType', 'country', 'currency'];
    foreach ($required_fields as $field) {
        if (empty($params[$field])) {
            return new WP_Error('missing_field', 'Missing required field: ' . $field, array('status' => 400));
        }
    }
    
    // Sanitize inputs
    $full_name = sanitize_text_field($params['fullName']);
    $email = sanitize_email($params['email']);
    $password = $params['password'];
    $account_type = sanitize_text_field($params['accountType']);
    $country = sanitize_text_field($params['country']);
    $currency = sanitize_text_field($params['currency']);
    $language = isset($params['language']) ? sanitize_text_field($params['language']) : ft_map_country_to_lang($country);
    $parent_consent = isset($params['parentConsent']) ? (bool)$params['parentConsent'] : false;
    
    // Validate email
    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email address', array('status' => 400));
    }
    
    // Check if email already exists
    if (email_exists($email)) {
        return new WP_Error('email_exists', 'This email is already registered', array('status' => 409));
    }
    
    // Validate password strength
    if (strlen($password) < 8) {
        return new WP_Error('weak_password', 'Password must be at least 8 characters', array('status' => 400));
    }
    
    if (!preg_match('/[A-Z]/', $password)) {
        return new WP_Error('weak_password', 'Password must contain at least one uppercase letter', array('status' => 400));
    }
    
    if (!preg_match('/[a-z]/', $password)) {
        return new WP_Error('weak_password', 'Password must contain at least one lowercase letter', array('status' => 400));
    }
    
    if (!preg_match('/[0-9]/', $password)) {
        return new WP_Error('weak_password', 'Password must contain at least one number', array('status' => 400));
    }
    
    if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)) {
        return new WP_Error('weak_password', 'Password must contain at least one special character', array('status' => 400));
    }
    
    // Generate username from email
    $username = sanitize_user(current(explode('@', $email)));
    
    // Make username unique if it exists
    if (username_exists($username)) {
        $username = $username . '_' . wp_generate_password(4, false);
    }
    
    // Create user
    $user_id = wp_create_user($username, $password, $email);
    
    if (is_wp_error($user_id)) {
        return new WP_Error('registration_failed', $user_id->get_error_message(), array('status' => 500));
    }
    
    // Update user meta with custom fields
    wp_update_user(array(
        'ID' => $user_id,
        'display_name' => $full_name,
        'first_name' => $full_name
    ));
    
    // Save custom meta data
    update_user_meta($user_id, 'account_type', $account_type);
    update_user_meta($user_id, 'country', $country);
    update_user_meta($user_id, 'currency', $currency);
    update_user_meta($user_id, 'language', $language);
    update_user_meta($user_id, 'parent_consent', $parent_consent);
    update_user_meta($user_id, 'registration_date', current_time('mysql'));
    
    // Email Verification logic
    update_user_meta($user_id, '_ft_email_verified', '0');
    $verification_token = wp_generate_password(64, false);
    update_user_meta($user_id, '_ft_verification_token', $verification_token);
    
    // Generate frontend URL for verification link
    $frontend_url = 'https://footballtalento.com'; // Should be dynamic in production
    $verification_link = $frontend_url . '/auth/verify-email?token=' . $verification_token;
    
    // Send verification email in user language
    $to = $email;
    $subject = ft_get_string('verify_email_subject', $language);
    $message = ft_get_verification_email_template($full_name, $verification_link, $language);
    
    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: FootballTalento <noreply@footballtalento.com>'
    );
    
    wp_mail($to, $subject, $message, $headers);
    
    return rest_ensure_response(array(
        'success' => true,
        'message' => 'Registration successful. Please check your email to verify your account.',
        'data' => array(
            'user_id' => $user_id,
            'username' => $username,
            'email' => $email,
            'display_name' => $full_name,
            'unverified' => true
        )
    ));
}
}

/**
 * Custom User Login Endpoint
 */
add_action('rest_api_init', function() {
    register_rest_route('footballtalento/v1', '/login', array(
        'methods' => 'POST',
        'callback' => 'ft_login_user',
        'permission_callback' => 'ft_validate_api_key'
    ));
});

if (!function_exists('ft_login_user')) {
    function ft_login_user($request) {
    $params = $request->get_json_params();
    
    // Honeypot check
    if (!empty($params['website_url'])) {
        return new WP_Error('honeypot_caught', 'Bot detected', array('status' => 403));
    }
    
    // Rate limit login: 5 attempts per 15 mins
    if (!ft_check_rate_limit('login', 5, 900)) {
        return new WP_Error('rate_limit', 'Too many login attempts. Please try again after 15 minutes.', array('status' => 429));
    }
    
    // Validate required fields
    if (empty($params['emailUsername']) || empty($params['password'])) {
        return new WP_Error('missing_credentials', 'Email/Username and password are required', array('status' => 400));
    }
    
    $email_username = sanitize_text_field($params['emailUsername']);
    $password = $params['password'];
    $remember = isset($params['remember']) ? (bool)$params['remember'] : false;
    
    // Determine if it's email or username
    $user = null;
    if (is_email($email_username)) {
        $user = get_user_by('email', $email_username);
    } else {
        $user = get_user_by('login', $email_username);
    }
    
    // If user not found
    if (!$user) {
        return new WP_Error('invalid_credentials', 'Invalid email/username or password', array('status' => 401));
    }
    
    // Check if email is verified
    $is_verified = get_user_meta($user->ID, '_ft_email_verified', true);
    if ($is_verified === '0') {
        return new WP_Error('email_not_verified', 'Please verify your email address before logging in.', array('status' => 403));
    }
    
    // Check password
    if (!wp_check_password($password, $user->data->user_pass, $user->ID)) {
        return new WP_Error('invalid_credentials', 'Invalid email/username or password', array('status' => 401));
    }
    
    // Generate authentication token
    $token = ft_generate_auth_token($user->ID, $remember);
    
    // Get user meta
    $account_type = get_user_meta($user->ID, 'account_type', true);
    $country = get_user_meta($user->ID, 'country', true);
    $currency = get_user_meta($user->ID, 'currency', true);
    
    return rest_ensure_response(array(
        'success' => true,
        'message' => 'Login successful',
        'data' => array(
            'user_id' => $user->ID,
            'username' => $user->user_login,
            'email' => $user->user_email,
            'display_name' => $user->display_name,
            'account_type' => $account_type,
            'country' => $country,
            'currency' => $currency,
            'token' => $token
        )
    ));
}
}

/**
 * Validate Token Endpoint
 */
add_action('rest_api_init', function() {
    register_rest_route('footballtalento/v1', '/validate-token', array(
        'methods' => 'POST',
        'callback' => 'ft_validate_token',
        'permission_callback' => 'ft_validate_api_key'
    ));
});

if (!function_exists('ft_validate_token')) {
    function ft_validate_token($request) {
    $params = $request->get_json_params();
    
    if (empty($params['token'])) {
        return new WP_Error('missing_token', 'Token is required', array('status' => 400));
    }
    
    $token = sanitize_text_field($params['token']);
    $user_id = ft_verify_auth_token($token);
    
    if (!$user_id) {
        return new WP_Error('invalid_token', 'Invalid or expired token', array('status' => 401));
    }
    
    $user = get_userdata($user_id);
    
    if (!$user) {
        return new WP_Error('user_not_found', 'User not found', array('status' => 404));
    }
    
    // Get user meta
    $account_type = get_user_meta($user_id, 'account_type', true);
    $country = get_user_meta($user_id, 'country', true);
    $currency = get_user_meta($user_id, 'currency', true);
    
    return rest_ensure_response(array(
        'success' => true,
        'data' => array(
            'user_id' => $user->ID,
            'username' => $user->user_login,
            'email' => $user->user_email,
            'display_name' => $user->display_name,
            'account_type' => $account_type,
            'country' => $country,
            'currency' => $currency
        )
    ));
}
}

/**
 * Logout Endpoint
 */
add_action('rest_api_init', function() {
    register_rest_route('footballtalento/v1', '/logout', array(
        'methods' => 'POST',
        'callback' => 'ft_logout_user',
        'permission_callback' => 'ft_validate_api_key'
    ));
});

if (!function_exists('ft_logout_user')) {
    function ft_logout_user($request) {
    $params = $request->get_json_params();
    
    if (!empty($params['token'])) {
        $token = sanitize_text_field($params['token']);
        ft_invalidate_token($token);
    }
    
    return rest_ensure_response(array(
        'success' => true,
        'message' => 'Logout successful'
    ));
}
}

/**
 * Forgot Password Endpoint
 */
add_action('rest_api_init', function() {
    register_rest_route('footballtalento/v1', '/forgot-password', array(
        'methods' => 'POST',
        'callback' => 'ft_forgot_password',
        'permission_callback' => 'ft_validate_api_key'
    ));
});

if (!function_exists('ft_forgot_password')) {
function ft_forgot_password($request) {
    $params = $request->get_json_params();
    
    if (empty($params['email'])) {
        return new WP_Error('missing_email', 'Email is required', array('status' => 400));
    }
    
    $email = sanitize_email($params['email']);
    
    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email address', array('status' => 400));
    }
    
    // Check if user exists
    $user = get_user_by('email', $email);
    
    if (!$user) {
        // For security, don't reveal if email exists or not
        return rest_ensure_response(array(
            'success' => true,
            'message' => 'If an account exists with this email, you will receive password reset instructions'
        ));
    }
    
    // Generate reset token
    $reset_token = wp_generate_password(32, false);
    $expiry = time() + (15 * MINUTE_IN_SECONDS); // 15 minutes
    
    // Store token in user meta
    update_user_meta($user->ID, 'password_reset_token', $reset_token);
    update_user_meta($user->ID, 'password_reset_expiry', $expiry);
    
    // Get user language
    $language = get_user_meta($user->ID, 'language', true);
    if (!$language) {
        $country = get_user_meta($user->ID, 'country', true);
        $language = ft_map_country_to_lang($country);
    }
    
    // Get frontend URL for reset link - UPDATE THIS!
    $frontend_url = 'https://footballtalento.com';
    $reset_link = $frontend_url . '/auth/reset-password?token=' . $reset_token;
    
    // Send HTML email with YOUR COLORS
    $to = $user->user_email;
    $subject = ft_get_string('forgot_password_subject', $language);
    $message = ft_get_forgot_password_email_template($user, $reset_link, $language);
    
    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: FootballTalento <noreply@footballtalento.com>'
    );
    
    wp_mail($to, $subject, $message, $headers);
    
    return rest_ensure_response(array(
        'success' => true,
        'message' => 'Password reset instructions have been sent to your email'
    ));
}
}

/**
 * Reset Password Endpoint
 */
add_action('rest_api_init', function() {
    register_rest_route('footballtalento/v1', '/reset-password', array(
        'methods' => 'POST',
        'callback' => 'ft_reset_password',
        'permission_callback' => 'ft_validate_api_key'
    ));
});

/**
 * Verify Email Endpoint
 */
add_action('rest_api_init', function() {
    register_rest_route('footballtalento/v1', '/verify-email', array(
        'methods' => 'POST',
        'callback' => 'ft_verify_email',
        'permission_callback' => 'ft_validate_api_key'
    ));
});

if (!function_exists('ft_verify_email')) {
function ft_verify_email($request) {
    $params = $request->get_json_params();
    if (empty($params['token'])) {
        return new WP_Error('missing_token', 'Verification token is required', array('status' => 400));
    }
    
    $token = sanitize_text_field($params['token']);
    
    $users = get_users(array(
        'meta_key' => '_ft_verification_token',
        'meta_value' => $token,
        'number' => 1
    ));
    
    if (empty($users)) {
        return new WP_Error('invalid_token', 'Invalid or expired verification token', array('status' => 404));
    }
    
    $user = $users[0];
    update_user_meta($user->ID, '_ft_email_verified', '1');
    delete_user_meta($user->ID, '_ft_verification_token');
    
    // Now trigger the welcome email since they are verified
    $account_type = get_user_meta($user->ID, 'account_type', true);
    $country = get_user_meta($user->ID, 'country', true);
    $currency = get_user_meta($user->ID, 'currency', true);
    $language = get_user_meta($user->ID, 'language', true);
    if (!$language) $language = ft_map_country_to_lang($country);
    
    $to = $user->user_email;
    $subject = ft_get_string('welcome_subject', $language);
    $message = ft_get_welcome_email_template($user, $account_type, $country, $currency, $language);
    
    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: FootballTalento <noreply@footballtalento.com>'
    );
    
    wp_mail($to, $subject, $message, $headers);
    
    return rest_ensure_response(array(
        'success' => true,
        'message' => 'Email verified successfully. You can now login.'
    ));
}
}

if (!function_exists('ft_reset_password')) {
function ft_reset_password($request) {
    $params = $request->get_json_params();
    
    if (empty($params['token']) || empty($params['newPassword'])) {
        return new WP_Error('missing_fields', 'Token and new password are required', array('status' => 400));
    }
    
    $token = sanitize_text_field($params['token']);
    $new_password = $params['newPassword'];
    
    // Validate password strength
    if (strlen($new_password) < 8) {
        return new WP_Error('weak_password', 'Password must be at least 8 characters', array('status' => 400));
    }
    
    if (!preg_match('/[A-Z]/', $new_password)) {
        return new WP_Error('weak_password', 'Password must contain at least one uppercase letter', array('status' => 400));
    }
    
    if (!preg_match('/[a-z]/', $new_password)) {
        return new WP_Error('weak_password', 'Password must contain at least one lowercase letter', array('status' => 400));
    }
    
    if (!preg_match('/[0-9]/', $new_password)) {
        return new WP_Error('weak_password', 'Password must contain at least one number', array('status' => 400));
    }
    
    if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $new_password)) {
        return new WP_Error('weak_password', 'Password must contain at least one special character', array('status' => 400));
    }
    
    // Find user with this token
    $users = get_users(array(
        'meta_key' => 'password_reset_token',
        'meta_value' => $token,
        'number' => 1
    ));
    
    if (empty($users)) {
        return new WP_Error('invalid_token', 'Invalid or expired reset token', array('status' => 400));
    }
    
    $user = $users[0];
    
    // Check if token is expired
    $expiry = get_user_meta($user->ID, 'password_reset_expiry', true);
    
    if (!$expiry || $expiry < time()) {
        // Delete expired token
        delete_user_meta($user->ID, 'password_reset_token');
        delete_user_meta($user->ID, 'password_reset_expiry');
        
        return new WP_Error('expired_token', 'Reset token has expired. Please request a new one.', array('status' => 400));
    }
    
    // Reset password
    wp_set_password($new_password, $user->ID);
    
    // Get user language
    $language = get_user_meta($user->ID, 'language', true);
    if (!$language) {
        $country = get_user_meta($user->ID, 'country', true);
        $language = ft_map_country_to_lang($country);
    }
    
    // Delete reset token
    delete_user_meta($user->ID, 'password_reset_token');
    delete_user_meta($user->ID, 'password_reset_expiry');
    
    // Invalidate all existing auth tokens for security
    delete_user_meta($user->ID, 'auth_tokens');
    
    // Send confirmation email with YOUR COLORS
    $to = $user->user_email;
    $subject = ft_get_string('password_changed_subject', $language);
    $message = ft_get_password_changed_email_template($user, $language);
    
    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: FootballTalento <noreply@footballtalento.com>'
    );
    
    wp_mail($to, $subject, $message, $headers);
    
    return rest_ensure_response(array(
        'success' => true,
        'message' => 'Password has been reset successfully'
    ));
}
}

/**
 * Generate Authentication Token
 */
if (!function_exists('ft_generate_auth_token')) {
function ft_generate_auth_token($user_id, $remember = false) {
    $expiry = $remember ? (time() + (30 * DAY_IN_SECONDS)) : (time() + DAY_IN_SECONDS);
    $token = wp_generate_password(64, false);
    
    // Store token in user meta
    $tokens = get_user_meta($user_id, 'auth_tokens', true);
    if (!is_array($tokens)) {
        $tokens = array();
    }
    
    // Clean expired tokens
    foreach ($tokens as $key => $token_data) {
        if ($token_data['expiry'] < time()) {
            unset($tokens[$key]);
        }
    }
    
    // Add new token
    $tokens[$token] = array(
        'expiry' => $expiry,
        'created' => time()
    );
    
    update_user_meta($user_id, 'auth_tokens', $tokens);
    
    return $token;
}
}

/**
 * Verify Authentication Token
 */
if (!function_exists('ft_verify_auth_token')) {
function ft_verify_auth_token($token) {
    global $wpdb;
    
    $users = $wpdb->get_results("SELECT user_id FROM {$wpdb->usermeta} WHERE meta_key = 'auth_tokens'");
    
    foreach ($users as $user) {
        $tokens = get_user_meta($user->user_id, 'auth_tokens', true);
        
        if (is_array($tokens) && isset($tokens[$token])) {
            if ($tokens[$token]['expiry'] > time()) {
                return $user->user_id;
            } else {
                // Token expired, remove it
                unset($tokens[$token]);
                update_user_meta($user->user_id, 'auth_tokens', $tokens);
            }
        }
    }
    
    return false;
}
}

/**
 * Invalidate Token
 */
if (!function_exists('ft_invalidate_token')) {
function ft_invalidate_token($token) {
    global $wpdb;
    
    $users = $wpdb->get_results("SELECT user_id FROM {$wpdb->usermeta} WHERE meta_key = 'auth_tokens'");
    
    foreach ($users as $user) {
        $tokens = get_user_meta($user->user_id, 'auth_tokens', true);
        
        if (is_array($tokens) && isset($tokens[$token])) {
            unset($tokens[$token]);
            update_user_meta($user->user_id, 'auth_tokens', $tokens);
            return true;
        }
    }
    
    return false;
}
}

/**
 * ============================================================
 * EMAIL TEMPLATES WITH YOUR BRAND COLORS
 * ============================================================
 */

/**
 * Welcome Email Template - YOUR BLUE COLORS
 */
function ft_get_welcome_email_template($user, $account_type, $country, $currency) {
    // Format account type
    $account_types = array(
        'player' => 'Player',
        'club' => 'Club / Academy',
        'scout' => 'Scout',
        'coach' => 'Coach',
        'parent' => 'Parent',
        'agent' => 'Agent',
        'sponsor' => 'Sponsor',
        'fan' => 'Fan'
    );
    $account_type_display = isset($account_types[$account_type]) ? $account_types[$account_type] : ucfirst($account_type);
    
    // Get login URL
    $login_url = 'https://footballtalento.com/auth/login'; // Update this to your frontend login URL
    
    return '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to FootballTalento</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif; background-color: #eef2fb;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #eef2fb;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(4, 86, 148, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #045694 0%, #0a84ff 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800;">Welcome to FootballTalento!</h1>
                            <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Your account has been created successfully</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px; color: #03122b; font-size: 16px; line-height: 1.6;">
                                Hi <strong>' . esc_html($user->display_name) . '</strong>,
                            </p>
                            <p style="margin: 0 0 20px; color: #505b73; font-size: 16px; line-height: 1.6;">
                                Thank you for joining <strong style="color: #045694;">FootballTalento</strong>! We\'re excited to have you as part of our community.
                            </p>
                            
                            <!-- Success Box -->
                            <div style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 10px; padding: 20px; margin: 30px 0;">
                                <p style="margin: 0 0 10px; color: #22c55e; font-size: 14px; font-weight: 600;">
                                    Registration Successful
                                </p>
                                <p style="margin: 0; color: #505b73; font-size: 14px; line-height: 1.5;">
                                    Your account was created on <strong style="color: #03122b;">' . date('F j, Y \a\t g:i A') . '</strong>
                                </p>
                            </div>
                            
                            <!-- Account Details -->
                            <div style="background-color: #eef2fb; border-radius: 10px; padding: 20px; margin: 30px 0;">
                                <p style="margin: 0 0 15px; color: #045694; font-size: 16px; font-weight: 600;">
                                    Your Account Details
                                </p>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #505b73; font-size: 14px;">Email:</td>
                                        <td style="padding: 8px 0; color: #03122b; font-size: 14px; font-weight: 600; text-align: right;">' . esc_html($user->user_email) . '</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #505b73; font-size: 14px;">Account Type:</td>
                                        <td style="padding: 8px 0; color: #03122b; font-size: 14px; font-weight: 600; text-align: right;">' . esc_html($account_type_display) . '</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #505b73; font-size: 14px;">Country:</td>
                                        <td style="padding: 8px 0; color: #03122b; font-size: 14px; font-weight: 600; text-align: right;">' . esc_html($country) . '</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #505b73; font-size: 14px;">Currency:</td>
                                        <td style="padding: 8px 0; color: #03122b; font-size: 14px; font-weight: 600; text-align: right;">' . esc_html($currency) . '</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 30px 0; width: 100%;">
                                <tr>
                                    <td align="center">
                                        <a href="' . esc_url($login_url) . '" style="display: inline-block; background: linear-gradient(135deg, #045694 0%, #0a84ff 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(4, 86, 148, 0.3);">
                                            Sign In to Your Account
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 20px 0 0; color: #505b73; font-size: 16px; line-height: 1.6;">
                                Start exploring our platform and connect with the football community!
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Getting Started Box -->
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <div style="background-color: rgba(10, 132, 255, 0.1); border: 1px solid rgba(10, 132, 255, 0.3); border-radius: 10px; padding: 20px;">
                                <p style="margin: 0 0 15px; color: #0a84ff; font-size: 14px; font-weight: 600;">
                                    Getting Started
                                </p>
                                <ul style="margin: 0; padding-left: 20px; color: #505b73; font-size: 13px; line-height: 1.8;">
                                    <li>Complete your profile to stand out</li>
                                    <li>Explore players, clubs, and scouts</li>
                                    <li>Connect with the football community</li>
                                    <li>Share your football journey</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Support Box -->
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <div style="background-color: #eef2fb; border-radius: 10px; padding: 20px; text-align: center;">
                                <p style="margin: 0 0 10px; color: #03122b; font-size: 14px; font-weight: 600;">
                                    Need Help?
                                </p>
                                <p style="margin: 0; color: #505b73; font-size: 13px; line-height: 1.6;">
                                    Our support team is here for you at<br>
                                    <a href="mailto:support@footballtalento.com" style="color: #0a84ff; text-decoration: none; font-weight: 600;">support@footballtalento.com</a>
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #eef2fb; padding: 30px; text-align: center; border-top: 1px solid #e4e8f0;">
                            <p style="margin: 0 0 15px; color: #505b73; font-size: 14px;">
                                Best regards,<br>
                                <strong style="color: #045694;">FootballTalento Team</strong>
                            </p>
                            <div style="margin: 20px 0;">
                                <a href="https://footballtalento.com" style="color: #0a84ff; text-decoration: none; font-size: 13px; margin: 0 10px;">Website</a>
                                <span style="color: #aab0be;">•</span>
                                <a href="#" style="color: #0a84ff; text-decoration: none; font-size: 13px; margin: 0 10px;">Support</a>
                                <span style="color: #aab0be;">•</span>
                                <a href="#" style="color: #0a84ff; text-decoration: none; font-size: 13px; margin: 0 10px;">Privacy</a>
                            </div>
                            <p style="margin: 15px 0 0; color: #aab0be; font-size: 12px;">
                                © 2024 FootballTalento. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';
}

/**
 * Forgot Password Email Template
 */
function ft_get_forgot_password_email_template($user, $reset_link, $lang = 'en') {
    $title = ft_get_string('reset_title', $lang);
    $desc = ft_get_string('reset_desc', $lang);
    $btn = ft_get_string('reset_btn', $lang);
    $hi = ft_get_string('hi', $lang);
    $expire = ft_get_string('expire_notice', $lang);
    $if_not_you = ft_get_string('if_not_you', $lang);
    $best_regards = ft_get_string('best_regards', $lang);
    $team_name = ft_get_string('team_name', $lang);
    $dir = ($lang === 'ar') ? 'rtl' : 'ltr';

    return '
<!DOCTYPE html>
<html dir="' . $dir . '">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . $title . '</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif; background-color: #eef2fb;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #eef2fb;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(4, 86, 148, 0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #045694 0%, #0a84ff 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800;">' . $title . '</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px; text-align: ' . ($lang === 'ar' ? 'right' : 'left') . ';">
                            <p style="margin: 0 0 20px; color: #03122b; font-size: 16px; line-height: 1.6;">
                                ' . $hi . ' <strong>' . esc_html($user->display_name) . '</strong>,
                            </p>
                            <p style="margin: 0 0 30px; color: #505b73; font-size: 16px; line-height: 1.6;">
                                ' . $desc . '
                            </p>
                            <table role="presentation" style="margin: 30px 0; width: 100%;">
                                <tr>
                                    <td align="center">
                                        <a href="' . esc_url($reset_link) . '" style="display: inline-block; background: linear-gradient(135deg, #045694 0%, #0a84ff 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(4, 86, 148, 0.3);">
                                            ' . $btn . '
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <div style="background-color: rgba(10, 132, 255, 0.1); border-radius: 10px; padding: 20px; text-align: center;">
                                <p style="margin: 0; color: #505b73; font-size: 14px;">' . $expire . '</p>
                            </div>
                            <p style="margin: 30px 0 0; color: #aab0be; font-size: 13px; text-align: center;">' . $if_not_you . '</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #eef2fb; padding: 30px; text-align: center; border-top: 1px solid #e4e8f0;">
                            <p style="margin: 0; color: #505b73; font-size: 14px;">' . $best_regards . '<br><strong>' . $team_name . '</strong></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';
}

/**
 * Password Changed Email Template
 */
function ft_get_password_changed_email_template($user, $lang = 'en') {
    $title = ft_get_string('pwd_changed_title', $lang);
    $desc = ft_get_string('pwd_changed_desc', $lang);
    $btn = ft_get_string('signin_now', $lang);
    $hi = ft_get_string('hi', $lang);
    $best_regards = ft_get_string('best_regards', $lang);
    $team_name = ft_get_string('team_name', $lang);
    $dir = ($lang === 'ar') ? 'rtl' : 'ltr';

    return '
<!DOCTYPE html>
<html dir="' . $dir . '">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . $title . '</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif; background-color: #eef2fb;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #eef2fb;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(4, 86, 148, 0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #045694 0%, #22c55e 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800;">' . $title . '</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px; text-align: ' . ($lang === 'ar' ? 'right' : 'left') . ';">
                            <p style="margin: 0 0 20px; color: #03122b; font-size: 16px; line-height: 1.6;">
                                ' . $hi . ' <strong>' . esc_html($user->display_name) . '</strong>,
                            </p>
                            <p style="margin: 0 0 30px; color: #505b73; font-size: 16px; line-height: 1.6;">
                                ' . $desc . '
                            </p>
                            <table role="presentation" style="margin: 30px 0; width: 100%;">
                                <tr>
                                    <td align="center">
                                        <a href="https://footballtalento.com/auth/login" style="display: inline-block; background: linear-gradient(135deg, #045694 0%, #0a84ff 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(4, 86, 148, 0.3);">
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #eef2fb; padding: 30px; text-align: center; border-top: 1px solid #e4e8f0;">
                            <p style="margin: 0 0 15px; color: #505b73; font-size: 14px;">
                                Best regards,<br>
                                <strong style="color: #045694;">FootballTalento Team</strong>
                            </p>
                            <div style="margin: 20px 0;">
                                <a href="https://footballtalento.com" style="color: #0a84ff; text-decoration: none; font-size: 13px; margin: 0 10px;">Website</a>
                                <span style="color: #aab0be;">•</span>
                                <a href="#" style="color: #0a84ff; text-decoration: none; font-size: 13px; margin: 0 10px;">Support</a>
                                <span style="color: #aab0be;">•</span>
                                <a href="#" style="color: #0a84ff; text-decoration: none; font-size: 13px; margin: 0 10px;">Privacy</a>
                            </div>
                            <p style="margin: 15px 0 0; color: #aab0be; font-size: 12px;">
                                © 2024 FootballTalento. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';
}

/**
 * ==================================================================
 * WORDPRESS ADMIN CUSTOMIZATIONS
 * ==================================================================
 */

/**
 * Add custom columns to Users table
 */
add_filter('manage_users_columns', 'ft_add_user_columns');
function ft_add_user_columns($columns) {
    // Add columns after username
    $new_columns = array();
    foreach ($columns as $key => $value) {
        $new_columns[$key] = $value;
        if ($key === 'username') {
            $new_columns['account_type'] = 'Account Type';
            $new_columns['country'] = 'Country';
            $new_columns['currency'] = 'Currency';
        }
    }
    return $new_columns;
}

/**
 * Display custom column content
 */
add_filter('manage_users_custom_column', 'ft_display_user_column_content', 10, 3);
function ft_display_user_column_content($value, $column_name, $user_id) {
    switch ($column_name) {
        case 'account_type':
            $account_type = get_user_meta($user_id, 'account_type', true);
            if ($account_type) {
                $types = array(
                    'player' => 'Player',
                    'club' => 'Club',
                    'scout' => 'Scout',
                    'coach' => 'Coach',
                    'parent' => 'Parent',
                    'agent' => 'Agent',
                    'sponsor' => 'Sponsor',
                    'fan' => 'Fan'
                );
                $value = isset($types[$account_type]) ? $types[$account_type] : ucfirst($account_type);
            } else {
                $value = '—';
            }
            break;
            
        case 'country':
            $country = get_user_meta($user_id, 'country', true);
            if ($country) {
                $countries = ft_get_countries_list();
                $value = isset($countries[$country]) ? $countries[$country] : $country;
            } else {
                $value = '—';
            }
            break;
            
        case 'currency':
            $currency = get_user_meta($user_id, 'currency', true);
            $value = $currency ? $currency : '—';
            break;
    }
    return $value;
}

/**
 * Verification Email Template
 */
function ft_get_verification_email_template($name, $link, $lang = 'en') {
    $title = ft_get_string('verify_title', $lang);
    $desc = ft_get_string('verify_desc', $lang);
    $btn = ft_get_string('verify_btn', $lang);
    $hi = ft_get_string('hi', $lang);
    $expire = ft_get_string('expire_notice', $lang);
    $footer_text = ft_get_string('best_regards', $lang) . '<br><strong style="color: #045694;">' . ft_get_string('team_name', $lang) . '</strong>';
    $dir = ($lang === 'ar') ? 'rtl' : 'ltr';

    return '
<!DOCTYPE html>
<html dir="' . $dir . '">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . $title . '</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif; background-color: #eef2fb;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #eef2fb;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(4, 86, 148, 0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #045694 0%, #0a84ff 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800;">' . $title . '</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px; text-align: ' . ($lang === 'ar' ? 'right' : 'left') . ';">
                            <p style="margin: 0 0 20px; color: #03122b; font-size: 16px; line-height: 1.6;">
                                ' . $hi . ' <strong>' . esc_html($name) . '</strong>,
                            </p>
                            <p style="margin: 0 0 30px; color: #505b73; font-size: 16px; line-height: 1.6;">
                                ' . $desc . '
                            </p>
                            <table role="presentation" style="margin: 30px 0; width: 100%;">
                                <tr>
                                    <td align="center">
                                        <a href="' . esc_url($link) . '" style="display: inline-block; background: linear-gradient(135deg, #045694 0%, #0a84ff 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(4, 86, 148, 0.3);">
                                            ' . $btn . '
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <div style="background-color: #eef2fb; border-radius: 10px; padding: 15px; margin-top: 30px; text-align: center;">
                                <p style="margin: 0; color: #505b73; font-size: 13px;">' . $expire . '</p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #eef2fb; padding: 30px; text-align: center; border-top: 1px solid #e4e8f0;">
                            <p style="margin: 0; color: #505b73; font-size: 14px;">' . $footer_text . '</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';
}

/**
 * Make custom columns sortable
 */
add_filter('manage_users_sortable_columns', 'ft_make_user_columns_sortable');
function ft_make_user_columns_sortable($columns) {
    $columns['account_type'] = 'account_type';
    $columns['country'] = 'country';
    $columns['currency'] = 'currency';
    return $columns;
}

/**
 * Handle custom column sorting
 */
add_action('pre_get_users', 'ft_sort_users_by_custom_column');
function ft_sort_users_by_custom_column($query) {
    if (!is_admin()) {
        return;
    }
    
    $orderby = $query->get('orderby');
    
    if ('account_type' === $orderby) {
        $query->set('meta_key', 'account_type');
        $query->set('orderby', 'meta_value');
    } elseif ('country' === $orderby) {
        $query->set('meta_key', 'country');
        $query->set('orderby', 'meta_value');
    } elseif ('currency' === $orderby) {
        $query->set('meta_key', 'currency');
        $query->set('orderby', 'meta_value');
    }
}

/**
 * Add custom fields to user profile page
 */
add_action('show_user_profile', 'ft_add_user_profile_fields');
add_action('edit_user_profile', 'ft_add_user_profile_fields');
function ft_add_user_profile_fields($user) {
    $account_type = get_user_meta($user->ID, 'account_type', true);
    $country = get_user_meta($user->ID, 'country', true);
    $currency = get_user_meta($user->ID, 'currency', true);
    $parent_consent = get_user_meta($user->ID, 'parent_consent', true);
    $registration_date = get_user_meta($user->ID, 'registration_date', true);
    ?>
    
    <h2>FootballTalento Profile Information</h2>
    <table class="form-table" role="presentation">
        
        <tr>
            <th><label for="account_type">Account Type</label></th>
            <td>
                <select name="account_type" id="account_type" class="regular-text">
                    <option value="">Select Account Type</option>
                    <option value="player" <?php selected($account_type, 'player'); ?>>Player</option>
                    <option value="club" <?php selected($account_type, 'club'); ?>>Club / Academy</option>
                    <option value="scout" <?php selected($account_type, 'scout'); ?>>Scout</option>
                    <option value="coach" <?php selected($account_type, 'coach'); ?>>Coach</option>
                    <option value="parent" <?php selected($account_type, 'parent'); ?>>Parent</option>
                    <option value="agent" <?php selected($account_type, 'agent'); ?>>Agent</option>
                    <option value="sponsor" <?php selected($account_type, 'sponsor'); ?>>Sponsor</option>
                    <option value="fan" <?php selected($account_type, 'fan'); ?>>Fan</option>
                </select>
                <p class="description">User's role in the FootballTalento platform</p>
            </td>
        </tr>
        
        <tr>
            <th><label for="country">Country</label></th>
            <td>
                <select name="country" id="country" class="regular-text">
                    <option value="">Select Country</option>
                    <?php
                    $countries = ft_get_countries_list();
                    foreach ($countries as $code => $name) {
                        echo '<option value="' . esc_attr($code) . '" ' . selected($country, $code, false) . '>' . esc_html($name) . '</option>';
                    }
                    ?>
                </select>
                <p class="description">User's country</p>
            </td>
        </tr>
        
        <tr>
            <th><label for="currency">Preferred Currency</label></th>
            <td>
                <select name="currency" id="currency" class="regular-text">
                    <option value="">Select Currency</option>
                    <?php
                    $currencies = ft_get_currencies_list();
                    foreach ($currencies as $code => $name) {
                        echo '<option value="' . esc_attr($code) . '" ' . selected($currency, $code, false) . '>' . esc_html($name) . '</option>';
                    }
                    ?>
                </select>
                <p class="description">User's preferred currency</p>
            </td>
        </tr>
        
        <?php if ($account_type === 'player'): ?>
        <tr>
            <th><label for="parent_consent">Parental Consent</label></th>
            <td>
                <label for="parent_consent">
                    <input type="checkbox" name="parent_consent" id="parent_consent" value="1" <?php checked($parent_consent, '1'); ?> />
                    User has parental/guardian consent (for under 18)
                </label>
                <p class="description">Required for players under 18 years old</p>
            </td>
        </tr>
        <?php endif; ?>
        
        <?php if ($registration_date): ?>
        <tr>
            <th>Registration Date</th>
            <td>
                <strong><?php echo date('F j, Y g:i A', strtotime($registration_date)); ?></strong>
                <p class="description">Date when user registered on FootballTalento</p>
            </td>
        </tr>
        <?php endif; ?>
        
    </table>
    
    <style>
        .form-table th[scope="row"] { width: 200px; }
        .form-table select.regular-text { min-width: 300px; }
    </style>
    <?php
}

/**
 * Save custom user profile fields
 */
add_action('personal_options_update', 'ft_save_user_profile_fields');
add_action('edit_user_profile_update', 'ft_save_user_profile_fields');
function ft_save_user_profile_fields($user_id) {
    if (!current_user_can('edit_user', $user_id)) {
        return false;
    }
    
    // Save account type
    if (isset($_POST['account_type'])) {
        update_user_meta($user_id, 'account_type', sanitize_text_field($_POST['account_type']));
    }
    
    // Save country
    if (isset($_POST['country'])) {
        update_user_meta($user_id, 'country', sanitize_text_field($_POST['country']));
    }
    
    // Save currency
    if (isset($_POST['currency'])) {
        update_user_meta($user_id, 'currency', sanitize_text_field($_POST['currency']));
    }
    
    // Save parent consent
    if (isset($_POST['parent_consent'])) {
        update_user_meta($user_id, 'parent_consent', '1');
    } else {
        update_user_meta($user_id, 'parent_consent', '0');
    }
}

/**
 * Welcome Email Template
 */
if (!function_exists('ft_get_welcome_email_template')) {
function ft_get_welcome_email_template($user, $account_type, $country, $currency, $lang = 'en') {
    $title = ft_get_string('welcome_title', $lang);
    $subtitle = ft_get_string('welcome_subtitle', $lang);
    $hi = ft_get_string('hi', $lang);
    $thank_you = ft_get_string('thank_you_joining', $lang);
    $reg_success = ft_get_string('reg_successful', $lang);
    $acc_created = ft_get_string('acc_created_on', $lang);
    $acc_details = ft_get_string('acc_details', $lang);
    $email_lbl = ft_get_string('email_label', $lang);
    $type_lbl = ft_get_string('acc_type_label', $lang);
    $country_lbl = ft_get_string('country_label', $lang);
    $currency_lbl = ft_get_string('currency_label', $lang);
    $signin_btn = ft_get_string('signin_btn', $lang);
    $start_exploring = ft_get_string('start_exploring', $lang);
    $gs_title = ft_get_string('getting_started', $lang);
    $best_regards = ft_get_string('best_regards', $lang);
    $team_name = ft_get_string('team_name', $lang);
    
    $account_types = array(
        'player' => 'Player',
        'club' => 'Club / Academy',
        'scout' => 'Scout',
        'coach' => 'Coach',
        'parent' => 'Parent',
        'agent' => 'Agent',
        'sponsor' => 'Sponsor',
        'fan' => 'Fan'
    );
    $account_type_display = isset($account_types[$account_type]) ? $account_types[$account_type] : ucfirst($account_type);
    $login_url = 'https://footballtalento.com/auth/login';
    $dir = ($lang === 'ar') ? 'rtl' : 'ltr';

    return '
<!DOCTYPE html>
<html dir="' . $dir . '">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . $title . '</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif; background-color: #eef2fb;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #eef2fb;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(4, 86, 148, 0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #045694 0%, #0a84ff 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800;">' . $title . '</h1>
                            <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">' . $subtitle . '</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px; text-align: ' . ($lang === 'ar' ? 'right' : 'left') . ';">
                            <p style="margin: 0 0 20px; color: #03122b; font-size: 16px; line-height: 1.6;">
                                ' . $hi . ' <strong>' . esc_html($user->display_name) . '</strong>,
                            </p>
                            <p style="margin: 0 0 20px; color: #505b73; font-size: 16px; line-height: 1.6;">
                                ' . $thank_you . '
                            </p>
                            <div style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 10px; padding: 20px; margin: 30px 0;">
                                <p style="margin: 0 0 10px; color: #22c55e; font-size: 14px; font-weight: 600;">' . $reg_success . '</p>
                                <p style="margin: 0; color: #505b73; font-size: 14px; line-height: 1.5;">' . $acc_created . ' <strong>' . date('F j, Y') . '</strong></p>
                            </div>
                            <div style="background-color: #eef2fb; border-radius: 10px; padding: 20px; margin: 30px 0;">
                                <p style="margin: 0 0 15px; color: #045694; font-size: 16px; font-weight: 600;">' . $acc_details . '</p>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr><td style="padding: 8px 0; color: #505b73; font-size: 14px;">' . $email_lbl . '</td><td style="padding: 8px 0; color: #03122b; font-size: 14px; font-weight: 600; text-align: right;">' . esc_html($user->user_email) . '</td></tr>
                                    <tr><td style="padding: 8px 0; color: #505b73; font-size: 14px;">' . $type_lbl . '</td><td style="padding: 8px 0; color: #03122b; font-size: 14px; font-weight: 600; text-align: right;">' . esc_html($account_type_display) . '</td></tr>
                                    <tr><td style="padding: 8px 0; color: #505b73; font-size: 14px;">' . $country_lbl . '</td><td style="padding: 8px 0; color: #03122b; font-size: 14px; font-weight: 600; text-align: right;">' . esc_html($country) . '</td></tr>
                                    <tr><td style="padding: 8px 0; color: #505b73; font-size: 14px;">' . $currency_lbl . '</td><td style="padding: 8px 0; color: #03122b; font-size: 14px; font-weight: 600; text-align: right;">' . esc_html($currency) . '</td></tr>
                                </table>
                            </div>
                            <table role="presentation" style="margin: 30px 0; width: 100%;">
                                <tr>
                                    <td align="center">
                                        <a href="' . esc_url($login_url) . '" style="display: inline-block; background: linear-gradient(135deg, #045694 0%, #0a84ff 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(4, 86, 148, 0.3);">
                                            ' . $signin_btn . '
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 20px 0 0; color: #505b73; font-size: 16px; line-height: 1.6;">' . $start_exploring . '</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #eef2fb; padding: 30px; text-align: center; border-top: 1px solid #e4e8f0;">
                            <p style="margin: 0; color: #505b73; font-size: 14px;">' . $best_regards . '<br><strong>' . $team_name . '</strong></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';
}
}

/**
 * Map country code to preferred language
 */
if (!function_exists('ft_map_country_to_lang')) {
function ft_map_country_to_lang($country_code) {
    $mapping = array(
        'MA' => 'ar', // Morocco -> Arabic
        'SA' => 'ar', // Saudi Arabia -> Arabic
        'AE' => 'ar', // UAE -> Arabic
        'EG' => 'ar', // Egypt -> Arabic
        'IQ' => 'ar', // Iraq -> Arabic
        'FR' => 'fr', // France -> French
        'IT' => 'it', // Italy -> Italian
        'DE' => 'de', // German -> German
        'AT' => 'de', // Austria -> German
        'CH' => 'de', // Switzerland -> German (Default to German)
        'ES' => 'es', // Spain -> Spanish
        'AR' => 'es', // Argentina -> Spanish
        'BR' => 'pt', // Brazil -> Portuguese
        'PT' => 'pt', // Portugal -> Portuguese
        'TR' => 'tr', // Turkey -> Turkish
    );
    
    return isset($mapping[$country_code]) ? $mapping[$country_code] : 'en';
}
}

/**
 * Simple translation helper for PHP backend
 */
if (!function_exists('ft_get_string')) {
function ft_get_string($key, $lang = 'en') {
    $strings = array(
        'en' => array(
            'verify_email_subject' => 'Verify Your Email - FootballTalento',
            'welcome_subject' => 'Welcome to FootballTalento - Email Verified',
            'forgot_password_subject' => 'Reset Your Password - FootballTalento',
            'password_changed_subject' => 'Password Changed Successfully - FootballTalento',
            'welcome_title' => 'Welcome to FootballTalento!',
            'welcome_subtitle' => 'Your account has been created successfully',
            'hi' => 'Hi',
            'thank_you_joining' => 'Thank you for joining FootballTalento! We\'re excited to have you as part of our community.',
            'reg_successful' => 'Registration Successful',
            'acc_created_on' => 'Your account was created on',
            'acc_details' => 'Your Account Details',
            'email_label' => 'Email:',
            'acc_type_label' => 'Account Type:',
            'country_label' => 'Country:',
            'currency_label' => 'Currency:',
            'signin_btn' => 'Sign In to Your Account',
            'start_exploring' => 'Start exploring our platform and connect with the football community!',
            'getting_started' => 'Getting Started',
            'gs_1' => 'Complete your profile to stand out',
            'gs_2' => 'Explore players, clubs, and scouts',
            'gs_3' => 'Connect with the football community',
            'gs_4' => 'Share your football journey',
            'need_help' => 'Need Help?',
            'support_text' => 'Our support team is here for you at',
            'best_regards' => 'Best regards,',
            'team_name' => 'FootballTalento Team',
            'verify_title' => 'Verify Your Email',
            'verify_desc' => 'Please click the button below to verify your email address and activate your account.',
            'verify_btn' => 'Verify Email Address',
            'reset_title' => 'Reset Your Password',
            'reset_desc' => 'We received a request to reset your password. Click the button below to create a new password.',
            'reset_btn' => 'Reset Password',
            'expire_notice' => 'This link will expire in 15 minutes for security purposes.',
            'if_not_you' => 'If you didn\'t request this, please ignore this email.',
            'pwd_changed_title' => 'Password Changed Successfully',
            'pwd_changed_desc' => 'Your password has been successfully updated.',
            'signin_now' => 'Sign In Now',
        ),
        'ar' => array(
            'verify_email_subject' => 'تأكيد بريدك الإلكتروني - FootballTalento',
            'welcome_subject' => 'مرحباً بك في FootballTalento - تم تأكيد البريد',
            'forgot_password_subject' => 'إعادة تعيين كلمة المرور - FootballTalento',
            'password_changed_subject' => 'تم تغيير كلمة المرور بنجاح - FootballTalento',
            'welcome_title' => 'مرحباً بك في FootballTalento!',
            'welcome_subtitle' => 'تم إنشاء حسابك بنجاح',
            'hi' => 'مرحباً',
            'thank_you_joining' => 'شكراً لانضمامك إلى FootballTalento! نحن متحمسون لوجودك كجزء من مجتمعنا.',
            'reg_successful' => ' تم التسجيل بنجاح',
            'acc_created_on' => 'تم إنشاء حسابك في',
            'acc_details' => 'تفاصيل حسابك',
            'email_label' => 'البريد الإلكتروني:',
            'acc_type_label' => 'نوع الحساب:',
            'country_label' => 'البلد:',
            'currency_label' => 'العملة:',
            'signin_btn' => 'تسجيل الدخول إلى حسابك',
            'start_exploring' => 'ابدأ في استكشاف منصتنا والتواصل مع مجتمع كرة القدم!',
            'getting_started' => 'البداية',
            'gs_1' => 'أكمل ملفك الشخصي لتبرز',
            'gs_2' => 'استكشف اللاعبين والأندية والكشافة',
            'gs_3' => 'تواصل مع مجتمع كرة القدم',
            'gs_4' => 'شارك رحلتك الكروية',
            'need_help' => 'هل تحتاج لمساعدة؟',
            'support_text' => 'فريق الدعم لدينا هنا من أجلك على',
            'best_regards' => 'مع أطيب التحيات،',
            'team_name' => 'فريق FootballTalento',
            'verify_title' => 'تأكيد بريدك الإلكتروني',
            'verify_btn' => 'تأكيد البريد الإلكتروني',
            'reset_title' => 'إعادة تعيين كلمة المرور',
            'reset_btn' => 'إعادة تعيين',
            'expire_notice' => 'هذا الرابط سينتهي مفعوله خلال 15 دقيقة لدواعي أمنية.',
            'pwd_changed_title' => 'تم تغيير كلمة المرور بنجاح',
            'signin_now' => 'سجل دخولك الآن',
        ),
        'fr' => array(
            'verify_email_subject' => 'Vérifiez votre e-mail - FootballTalento',
            'welcome_subject' => 'Bienvenue sur FootballTalento - E-mail vérifié',
            'welcome_title' => 'Bienvenue sur FootballTalento !',
            'hi' => 'Bonjour',
            'reg_successful' => ' Inscription réussie',
            'signin_btn' => 'Se connecter à votre compte',
            'verify_title' => 'Vérifiez votre e-mail',
            'verify_btn' => 'Vérifier l\'adresse e-mail',
            'reset_title' => 'Réinitialiser votre mot de passe',
            'reset_btn' => 'Réinitialiser le mot de passe',
            'pwd_changed_title' => 'Mot de passe changé avec succès',
            'signin_now' => 'Se connecter maintenant',
        ),
        'es' => array(
            'verify_email_subject' => 'Verifica tu correo - FootballTalento',
            'welcome_subject' => 'Bienvenido a FootballTalento - Correo verificado',
            'welcome_title' => '¡Bienvenido a FootballTalento!',
            'hi' => 'Hola',
            'reg_successful' => ' Registro exitoso',
            'signin_btn' => 'Inicia sesión en tu cuenta',
            'verify_title' => 'Verifica tu correo',
            'verify_btn' => 'Verificar correo',
            'reset_title' => 'Restablecer contraseña',
            'reset_btn' => 'Restablecer contraseña',
            'pwd_changed_title' => 'Contraseña cambiada con éxito',
            'signin_now' => 'Entrar ahora',
        ),
        'it' => array(
            'verify_email_subject' => 'Verifica la tua email - FootballTalento',
            'welcome_subject' => 'Benvenuto su FootballTalento - Email verificata',
            'welcome_title' => 'Benvenuto su FootballTalento!',
            'hi' => 'Ciao',
            'reg_successful' => ' Registrazione completata',
            'signin_btn' => 'Accedi al tuo account',
            'verify_title' => 'Verifica la tua email',
            'verify_btn' => 'Verifica indirizzo email',
            'reset_title' => 'Reimposta la password',
            'reset_btn' => 'Reimposta password',
            'pwd_changed_title' => 'Password cambiata con successo',
            'signin_now' => 'Accedi ora',
        ),
        'de' => array(
            'verify_email_subject' => 'E-Mail verifizieren - FootballTalento',
            'welcome_subject' => 'Willkommen bei FootballTalento - E-Mail verifiziert',
            'welcome_title' => 'Willkommen bei FootballTalento!',
            'hi' => 'Hallo',
            'reg_successful' => ' Registrierung erfolgreich',
            'signin_btn' => 'In Ihr Konto einloggen',
            'verify_title' => 'E-Mail verifizieren',
            'verify_btn' => 'E-Mail-Adresse bestätigen',
            'reset_title' => 'Passwort zurücksetzen',
            'reset_btn' => 'Passwort zurücksetzen',
            'pwd_changed_title' => 'Passwort erfolgreich geändert',
            'signin_now' => 'Jetzt einloggen',
        ),
        'pt' => array(
            'verify_email_subject' => 'Verifique seu e-mail - FootballTalento',
            'welcome_subject' => 'Bem-vindo ao FootballTalento - E-mail verificado',
            'welcome_title' => 'Bem-vindo ao FootballTalento!',
            'hi' => 'Olá',
            'reg_successful' => ' Registro bem-sucedido',
            'signin_btn' => 'Entrar na sua conta',
            'verify_title' => 'Verifique seu e-mail',
            'verify_btn' => 'Verificar endereço de e-mail',
            'reset_title' => 'Redefinir sua senha',
            'reset_btn' => 'Redefinir senha',
            'pwd_changed_title' => 'Senha alterada com sucesso',
            'signin_now' => 'Entrar agora',
        ),
        'tr' => array(
            'verify_email_subject' => 'E-postanızı Doğrulayın - FootballTalento',
            'welcome_subject' => 'FootballTalento\'ya Hoş Geldiniz - E-posta Doğrulandı',
            'welcome_title' => 'FootballTalento\'ya Hoş Geldiniz!',
            'hi' => 'Merhaba',
            'reg_successful' => ' Kayıt Başarılı',
            'signin_btn' => 'Hesabınıza Giriş Yapın',
            'verify_title' => 'E-postanızı Doğrulayın',
            'verify_btn' => 'E-posta Adresini Doğrula',
            'reset_title' => 'Şifrenizi Sıfırlayın',
            'reset_btn' => 'Şifreyi Sıfırla',
            'pwd_changed_title' => 'Şifre Başarıyla Değiştirildi',
            'signin_now' => 'Şimdi Giriş Yap',
        ),
    );
    
    // Fallback to English if key or lang missing
    if (!isset($strings[$lang][$key])) {
        return isset($strings['en'][$key]) ? $strings['en'][$key] : $key;
    }
    
    return $strings[$lang][$key];
}
}

/**
 * Add bulk action to change account type
 */
add_filter('bulk_actions-users', 'ft_add_bulk_actions');
if (!function_exists('ft_add_bulk_actions')) {
function ft_add_bulk_actions($actions) {
    $actions['ft_change_to_player'] = 'Change to Player';
    $actions['ft_change_to_club'] = 'Change to Club';
    $actions['ft_change_to_scout'] = 'Change to Scout';
    $actions['ft_change_to_coach'] = 'Change to Coach';
    return $actions;
}
}

/**
 * Handle bulk action for account type change
 */
add_filter('handle_bulk_actions-users', 'ft_handle_bulk_actions', 10, 3);
if (!function_exists('ft_handle_bulk_actions')) {
function ft_handle_bulk_actions($redirect_to, $action, $user_ids) {
    $account_types = array(
        'ft_change_to_player' => 'player',
        'ft_change_to_club' => 'club',
        'ft_change_to_scout' => 'scout',
        'ft_change_to_coach' => 'coach',
    );
    
    if (isset($account_types[$action])) {
        $new_type = $account_types[$action];
        foreach ($user_ids as $user_id) {
            update_user_meta($user_id, 'account_type', $new_type);
        }
        $redirect_to = add_query_arg('ft_bulk_updated', count($user_ids), $redirect_to);
    }
    
    return $redirect_to;
}
}

/**
 * Show admin notice after bulk update
 */
add_action('admin_notices', 'ft_bulk_action_admin_notice');
if (!function_exists('ft_bulk_action_admin_notice')) {
function ft_bulk_action_admin_notice() {
    if (!empty($_REQUEST['ft_bulk_updated'])) {
        $count = intval($_REQUEST['ft_bulk_updated']);
        printf(
            '<div class="notice notice-success is-dismissible"><p>%s</p></div>',
            sprintf(_n('%s user account type updated.', '%s users account type updated.', $count), $count)
        );
    }
}
}
