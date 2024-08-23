'use client';

import { useEffect, useState } from 'react';

export default function WhoAmIServerAction({
  onGetUserAction,
}: {
  onGetUserAction: () => Promise<string | null>;
}) {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    onGetUserAction().then((userData) => setUser(userData));
  }, [onGetUserAction]);

  return <div className="mt-5">Who Am I (server action): {user}</div>;
}
