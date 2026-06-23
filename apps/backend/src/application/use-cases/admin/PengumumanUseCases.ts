export class CreatePengumumanUseCase {
  constructor(private prisma: any) {}

  async execute(input: {
    judul: string;
    konten: string;
    targetRoles: string[];
    prodiId?: string;
    isDraft?: boolean;
  }) {
    const pengumuman = await this.prisma.pengumuman.create({
      data: {
        judul: input.judul,
        konten: input.konten,
        target_role: input.targetRoles,
        prodi_id: input.prodiId,
        status: input.isDraft ? 'DRAFT' : 'PUBLISHED',
        created_at: new Date(),
        created_by_id: this.prisma._requestContext?.userId, // Set during middleware
      },
      include: {
        created_by: {
          select: {
            nama_lengkap: true,
            email: true,
          },
        },
      },
    });

    return pengumuman;
  }
}

export class GetAllPengumumanUseCase {
  constructor(private prisma: any) {}

  async execute(filters?: {
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    targetRole?: string;
    prodiId?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.targetRole) where.target_role = { has: filters.targetRole };
    if (filters?.prodiId) where.prodi_id = filters.prodiId;

    const pengumuman = await this.prisma.pengumuman.findMany({
      where,
      include: {
        created_by: {
          select: {
            nama_lengkap: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take: filters?.limit || 10,
      skip: filters?.offset || 0,
    });

    const total = await this.prisma.pengumuman.count({ where });

    return { pengumuman, total };
  }
}

export class GetPengumumanByIdUseCase {
  constructor(private prisma: any) {}

  async execute(id: string) {
    const pengumuman = await this.prisma.pengumuman.findUnique({
      where: { id },
      include: {
        created_by: {
          select: {
            nama_lengkap: true,
            email: true,
          },
        },
      },
    });

    if (!pengumuman) {
      throw new Error('Pengumuman tidak ditemukan');
    }

    // Increment views
    await this.prisma.pengumuman.update({
      where: { id },
      data: {
        views: { increment: 1 },
      },
    });

    return pengumuman;
  }
}

export class UpdatePengumumanUseCase {
  constructor(private prisma: any) {}

  async execute(
    id: string,
    input: {
      judul?: string;
      konten?: string;
      targetRoles?: string[];
      status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    }
  ) {
    const pengumuman = await this.prisma.pengumuman.findUnique({
      where: { id },
    });

    if (!pengumuman) {
      throw new Error('Pengumuman tidak ditemukan');
    }

    const updated = await this.prisma.pengumuman.update({
      where: { id },
      data: {
        ...(input.judul && { judul: input.judul }),
        ...(input.konten && { konten: input.konten }),
        ...(input.targetRoles && { target_role: input.targetRoles }),
        ...(input.status && { status: input.status }),
        updated_at: new Date(),
      },
      include: {
        created_by: {
          select: {
            nama_lengkap: true,
            email: true,
          },
        },
      },
    });

    return updated;
  }
}

export class DeletePengumumanUseCase {
  constructor(private prisma: any) {}

  async execute(id: string) {
    const pengumuman = await this.prisma.pengumuman.findUnique({
      where: { id },
    });

    if (!pengumuman) {
      throw new Error('Pengumuman tidak ditemukan');
    }

    await this.prisma.pengumuman.delete({
      where: { id },
    });

    return { success: true, message: 'Pengumuman berhasil dihapus' };
  }
}

export class PublishPengumumanUseCase {
  constructor(private prisma: any) {}

  async execute(id: string) {
    const pengumuman = await this.prisma.pengumuman.findUnique({
      where: { id },
    });

    if (!pengumuman) {
      throw new Error('Pengumuman tidak ditemukan');
    }

    if (pengumuman.status === 'PUBLISHED') {
      throw new Error('Pengumuman sudah dipublikasikan');
    }

    const updated = await this.prisma.pengumuman.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        published_at: new Date(),
      },
      include: {
        created_by: {
          select: {
            nama_lengkap: true,
            email: true,
          },
        },
      },
    });

    return updated;
  }
}
