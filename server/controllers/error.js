export default function get404(req, res, next) {
    res.status(404).json({ message: 'Page Not Found', path: '/404' });
}
