const ADMIN_ROLE = "Administrateur";
const MODERATOR_ROLE = "Modérateur";

function isAdminRole(role) {
  return role === ADMIN_ROLE;
}

function isModeratorRole(role) {
  return role === MODERATOR_ROLE;
}

function canModerate(role) {
  return isAdminRole(role) || isModeratorRole(role);
}

module.exports = {
  ADMIN_ROLE,
  MODERATOR_ROLE,
  isAdminRole,
  isModeratorRole,
  canModerate,
};
