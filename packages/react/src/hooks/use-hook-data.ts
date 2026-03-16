import { useHookDataContext } from '../providers/hook-data-provider.js';

export function useHookData(hookId: string): unknown {
	const { hookData } = useHookDataContext();
	return hookData[hookId];
}

export function useHookLoading(): boolean {
	const { isLoading } = useHookDataContext();
	return isLoading;
}

export function useHookError(hookId: string): Error | undefined {
	const { errors } = useHookDataContext();
	return errors[hookId];
}
