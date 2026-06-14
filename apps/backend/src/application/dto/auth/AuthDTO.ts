// Request DTOs
export interface RegisterDTO {
  email: string;
  password: string;
  role: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface ResetPasswordDTO {
  email: string;
  oldPassword: string;
  newPassword: string;
}

// Response DTOs
export interface AuthResponseDTO {
  user: {
    id: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface TokenResponseDTO {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface CurrentUserDTO {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
}
