import client from './client';

export async function getAllUsers(): Promise<unknown[]> {
  const res = await client.get('/admin/all-users');

  if (Array.isArray(res.data)) {
    return res.data;
  }

  if (
    res.data &&
    typeof res.data === 'object' &&
    Array.isArray(
      (res.data as Record<string, unknown>).users
    )
  ) {
    return (
      (res.data as Record<string, unknown>).users as unknown[]
    );
  }

  return [];
}

export async function makeAdmin(userId: string) {
  const res = await client.post(
    `/admin/make-admin/${userId}`
  );

  return res.data;
}

export async function removeAdmin(userId: string) {
  const res = await client.delete(
    `/admin/remove-admin/${userId}`
  );

  return res.data;
}

export async function clearAppCache(): Promise<unknown> {
  const res = await client.get('/admin/clear-app-cache');

  return res.data;
}