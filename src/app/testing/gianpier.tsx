"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function GianpierTest() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
    },
  });
  return <div className="w-full max-w-xs">Hola</div>;
}

export default GianpierTest;
