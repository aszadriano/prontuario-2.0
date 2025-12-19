import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_ROLES } from '@prontuario/shared';
import { RolesGuard } from './roles.guard';

const mockContext = (userRole?: string) => ({
  switchToHttp: () => ({
    getRequest: () => ({
      user: userRole
        ? {
            id: 'user',
            role: userRole
          }
        : null
    })
  }),
  getHandler: () => ({}),
  getClass: () => ({})
});

describe('RolesGuard', () => {
  const reflector = new Reflector();
  const guard = new RolesGuard(reflector);

  it('allows access when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    expect(guard.canActivate(mockContext(USER_ROLES.ADMIN) as any)).toBe(true);
  });

  it('allows when user role matches', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([USER_ROLES.MEDICO]);
    expect(guard.canActivate(mockContext(USER_ROLES.MEDICO) as any)).toBe(true);
  });

  it('throws when user role does not match', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([USER_ROLES.ADMIN]);

    expect(() => guard.canActivate(mockContext(USER_ROLES.SECRETARIA) as any)).toThrow(
      ForbiddenException
    );
  });
});
