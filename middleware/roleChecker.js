export async function RoleChecker(req, res, next) {
    const user = req.user;
    const { role } = user;
    req.check = {
        isAdmin: true,
        isPSHEAD: true,
        isPCHEAD: true,
        isPSCLERK: true,
        isPCSTAFF: true,
    }
    if (role !== "admin") {
        req.check.isAdmin = false;
    }
    if (role !== "p-s_head") {
        req.check.isPSHEAD = false;
    }
    if (role !== "p-c_head") {
        req.check.isPCHEAD = false;
    }
    if (role !== "p-s_clerk") {
        req.check.isPSCLERK = false;
    }
    if (role !== "p-c_staff") {
        req.check.isPCSTAFF = false;
    }
    next();
}