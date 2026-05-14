"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

type QueryProviderProps = {
	children: React.ReactNode;
};

export function QueryProvider({ children }: QueryProviderProps) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
		</QueryClientProvider>
	);
}
