export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/super-admin/', '/checkout/'],
        },
        sitemap: 'https://saujikirana.com/sitemap.xml',
    }
}
