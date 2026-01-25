/**
 * FootballTalento - Home Content Management API
 * Manage Hero Slider, Success Stories, and Trusted Clubs from WordPress
 */

// Exit if accessed directly
if (!defined('ABSPATH')) exit;

/**
 * Register Custom Post Types for Home Content
 */
add_action('init', 'ft_register_content_cpts');
if (!function_exists('ft_register_content_cpts')) {
function ft_register_content_cpts() {
    // 1. Hero Slides
    register_post_type('ft_slide', array(
        'labels' => array('name' => 'Hero Slides', 'singular_name' => 'Slide'),
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-images-alt2',
        'supports' => array('title', 'thumbnail'),
    ));

    // 2. Success Stories (Reviews)
    register_post_type('ft_review', array(
        'labels' => array('name' => 'Success Stories', 'singular_name' => 'Review'),
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-testimonial',
        'supports' => array('title'),
    ));

    // 3. Trusted Clubs
    register_post_type('ft_club', array(
        'labels' => array('name' => 'Trusted Clubs', 'singular_name' => 'Club'),
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-groups',
        'supports' => array('title', 'thumbnail'),
    ));
}
}

/**
 * Add Meta Boxes for Content Management
 */
add_action('add_meta_boxes', 'ft_add_content_meta_boxes');
if (!function_exists('ft_add_content_meta_boxes')) {
function ft_add_content_meta_boxes() {
    // Slide Meta
    add_meta_box('ft_slide_settings', 'Slide Settings (Multilingual)', 'ft_render_slide_meta_box', 'ft_slide', 'normal', 'high');
    
    // Review Meta
    add_meta_box('ft_review_settings', 'Review Details', 'ft_render_review_meta_box', 'ft_review', 'normal', 'high');
    
    // Club Meta (If needed beyond thumbnail)
    add_meta_box('ft_club_settings', 'Club Details', 'ft_render_club_meta_box', 'ft_club', 'side', 'default');
}
}

/**
 * Render Slide Meta Box
 */
if (!function_exists('ft_render_slide_meta_box')) {
function ft_render_slide_meta_box($post) {
    wp_nonce_field('ft_content_meta_nonce', 'ft_content_nonce');
    $langs = array('en' => 'English', 'ar' => 'Arabic', 'fr' => 'French', 'it' => 'Italian', 'de' => 'German', 'es' => 'Spanish', 'pt' => 'Portuguese', 'tr' => 'Turkish');
    
    echo '<div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ccd0d4;">';
    echo '<h4>Global Links</h4>';
    echo '<p><label>CTA 1 Link:</label><br><input type="text" name="cta1_link" value="' . esc_attr(get_post_meta($post->ID, 'cta1_link', true)) . '" style="width:100%;"></p>';
    echo '<p><label>CTA 2 Link:</label><br><input type="text" name="cta2_link" value="' . esc_attr(get_post_meta($post->ID, 'cta2_link', true)) . '" style="width:100%;"></p>';
    echo '</div>';

    foreach ($langs as $code => $name) {
        $title = get_post_meta($post->ID, "title_{$code}", true);
        $desc = get_post_meta($post->ID, "desc_{$code}", true);
        $highlights = get_post_meta($post->ID, "highlights_{$code}", true);
        $badges = get_post_meta($post->ID, "badges_{$code}", true);
        $cta1_text = get_post_meta($post->ID, "cta1_text_{$code}", true);
        $cta2_text = get_post_meta($post->ID, "cta2_text_{$code}", true);

        echo '<details style="margin-bottom: 10px; border: 1px solid #ccd0d4; padding: 10px; border-radius: 4px;">';
        echo '<summary style="font-weight: bold; cursor: pointer; padding: 5px;">' . $name . ' Content</summary>';
        echo '<div style="padding-top: 10px;">';
        echo '<p><label>Title (' . $code . '):</label><br><input type="text" name="title_' . $code . '" value="' . esc_attr($title) . '" style="width:100%;"></p>';
        echo '<p><label>Description (' . $code . '):</label><br><textarea name="desc_' . $code . '" style="width:100%;" rows="2">' . esc_textarea($desc) . '</textarea></p>';
        echo '<p><label>Highlights (' . $code . ') - Comma Separated:</label><br><input type="text" name="highlights_' . $code . '" value="' . esc_attr($highlights) . '" style="width:100%;" placeholder="e.g. Verified, Global, Safe"></p>';
        echo '<p><label>Badges (Max 3) - Comma Separated:</label><br><input type="text" name="badges_' . $code . '" value="' . esc_attr($badges) . '" style="width:100%;"></p>';
        echo '<p><label>CTA 1 Button Text:</label><br><input type="text" name="cta1_text_' . $code . '" value="' . esc_attr($cta1_text) . '" style="width:100%;"></p>';
        echo '<p><label>CTA 2 Button Text:</label><br><input type="text" name="cta2_text_' . $code . '" value="' . esc_attr($cta2_text) . '" style="width:100%;"></p>';
        echo '</div>';
        echo '</details>';
    }
}
}

/**
 * Render Review Meta Box
 */
if (!function_exists('ft_render_review_meta_box')) {
function ft_render_review_meta_box($post) {
    wp_nonce_field('ft_content_meta_nonce', 'ft_content_nonce');
    
    echo '<div style="margin-bottom: 20px;">';
    echo '<p><label>Role:</label><br><input type="text" name="role" value="' . esc_attr(get_post_meta($post->ID, 'role', true)) . '" style="width:100%;" placeholder="e.g. U17 Midfielder"></p>';
    echo '<p><label>Location:</label><br><input type="text" name="location" value="' . esc_attr(get_post_meta($post->ID, 'location', true)) . '" style="width:100%;"></p>';
    echo '<p><label>Message:</label><br><textarea name="message" style="width:100%;" rows="4">' . esc_textarea(get_post_meta($post->ID, 'message', true)) . '</textarea></p>';
    echo '<p><label>Success Badge Text:</label><br><input type="text" name="badge" value="' . esc_attr(get_post_meta($post->ID, 'badge', true)) . '" style="width:100%;" placeholder="e.g. Academy Trial Secured"></p>';
    echo '<p><label>Rating (1-5):</label><br><input type="number" name="rating" value="' . esc_attr(get_post_meta($post->ID, 'rating', true) ?: 5) . '" min="1" max="5"></p>';
    echo '</div>';
}
}

/**
 * Render Club Meta Box
 */
if (!function_exists('ft_render_club_meta_box')) {
function ft_render_club_meta_box($post) {
    echo '<p>Use the <strong>Featured Image</strong> for the club logo.</p>';
}
}

/**
 * Save Meta Box Data
 */
add_action('save_post', 'ft_save_content_meta');
if (!function_exists('ft_save_content_meta')) {
function ft_save_content_meta($post_id) {
    if (!isset($_POST['ft_content_nonce']) || !wp_verify_nonce($_POST['ft_content_nonce'], 'ft_content_meta_nonce')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    $langs = array('en', 'ar', 'fr', 'it', 'de', 'es', 'pt', 'tr');
    
    // Save Generic Fields (Including Reviews now)
    $generic_fields = array('cta1_link', 'cta2_link', 'role', 'rating', 'location', 'message', 'badge');
    foreach ($generic_fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, $field, sanitize_text_field($_POST[$field]));
        }
    }

    // Save Multilingual Fields (Slides only)
    $localized_fields = array('title', 'desc', 'highlights', 'badges', 'cta1_text', 'cta2_text');
    foreach ($langs as $code) {
        foreach ($localized_fields as $field) {
            $key = "{$field}_{$code}";
            if (isset($_POST[$key])) {
                update_post_meta($post_id, $key, wp_kses_post($_POST[$key]));
            }
        }
    }
}
}

/**
 * Register API Route for Home Content
 */
add_action('rest_api_init', function() {
    register_rest_route('footballtalento/v1', '/home-content', array(
        'methods' => 'GET',
        'callback' => 'ft_get_home_content',
        'permission_callback' => '__return_true' // Publicly accessible
    ));
});

/**
 * Get all home content in one request
 */
if (!function_exists('ft_get_home_content')) {
function ft_get_home_content($request) {
    $lang = $request->get_param('lang') ? sanitize_text_field($request->get_param('lang')) : 'en';

    return rest_ensure_response(array(
        'success' => true,
        'data' => array(
            'slides' => ft_get_dynamic_slides($lang),
            'reviews' => ft_get_dynamic_reviews($lang),
            'clubs' => ft_get_dynamic_clubs()
        )
    ));
}
}

/**
 * Fetch and format Hero Slides
 */
if (!function_exists('ft_get_dynamic_slides')) {
function ft_get_dynamic_slides($lang) {
    $posts = get_posts(array(
        'post_type' => 'ft_slide',
        'posts_per_page' => -1,
        'orderby' => 'menu_order',
        'order' => 'ASC'
    ));

    $slides = array();
    foreach ($posts as $post) {
        $id = $post->ID;
        
        // Use translated fields if available, fallback to English
        $title = get_post_meta($id, "title_{$lang}", true) ?: get_post_meta($id, "title_en", true) ?: $post->post_title;
        $desc = get_post_meta($id, "desc_{$lang}", true) ?: get_post_meta($id, "desc_en", true);
        
        // Highlights (comma separated)
        $highlights_str = get_post_meta($id, "highlights_{$lang}", true) ?: get_post_meta($id, "highlights_en", true);
        $highlights = $highlights_str ? array_map('trim', explode(',', $highlights_str)) : array();
        
        // Badges (comma separated)
        $badges_str = get_post_meta($id, "badges_{$lang}", true) ?: get_post_meta($id, "badges_en", true);
        $badges = $badges_str ? array_map('trim', explode(',', $badges_str)) : array();

        // CTA Buttons
        $cta1_text = get_post_meta($id, "cta1_text_{$lang}", true) ?: get_post_meta($id, "cta1_text_en", true);
        $cta1_link = get_post_meta($id, "cta1_link", true) ?: '#';
        
        $cta2_text = get_post_meta($id, "cta2_text_{$lang}", true) ?: get_post_meta($id, "cta2_text_en", true);
        $cta2_link = get_post_meta($id, "cta2_link", true) ?: '#';

        $slides[] = array(
            'id' => $id,
            'image' => get_the_post_thumbnail_url($id, 'full'),
            'title' => $title,
            'description' => $desc,
            'highlights' => $highlights,
            'badges' => $badges,
            'cta1' => array('text' => $cta1_text, 'link' => $cta1_link),
            'cta2' => array('text' => $cta2_text, 'link' => $cta2_link)
        );
    }
    return $slides;
}
}

/**
 * Fetch and format Success Stories
 */
if (!function_exists('ft_get_dynamic_reviews')) {
function ft_get_dynamic_reviews($lang) {
    $posts = get_posts(array(
        'post_type' => 'ft_review',
        'posts_per_page' => -1,
    ));

    $reviews = array();
    foreach ($posts as $post) {
        $id = $post->ID;
        $reviews[] = array(
            'id' => $id,
            'name' => $post->post_title,
            'role' => get_post_meta($id, 'role', true),
            'location' => get_post_meta($id, 'location', true),
            'message' => get_post_meta($id, 'message', true),
            'badge' => get_post_meta($id, 'badge', true),
            'rating' => (int)get_post_meta($id, 'rating', true) ?: 5
        );
    }
    return $reviews;
}
}

/**
 * Fetch and format Trusted Clubs
 */
if (!function_exists('ft_get_dynamic_clubs')) {
function ft_get_dynamic_clubs() {
    $posts = get_posts(array(
        'post_type' => 'ft_club',
        'posts_per_page' => -1,
    ));

    $clubs = array();
    foreach ($posts as $post) {
        $id = $post->ID;
        $clubs[] = array(
            'id' => $id,
            'name' => $post->post_title,
            'logo' => get_the_post_thumbnail_url($id, 'large')
        );
    }
    return $clubs;
}
}
