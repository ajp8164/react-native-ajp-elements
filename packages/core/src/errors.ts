export class LibError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LibError';
  }
}

export class BiometricsError extends LibError {
  constructor(message: string) {
    super(message);
    this.name = 'BiometricsError';
  }
}
