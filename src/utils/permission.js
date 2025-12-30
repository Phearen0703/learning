export const hasRole = (user, role) => {
  return user?.roles?.includes(role);
};

export const hasPermission = (user, permission) => {
  return user?.permissions?.includes(permission);
};
