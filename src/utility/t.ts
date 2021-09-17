// Implementing osryisrblx/t module
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

type Callback = (...args: any[]) => void;

type CheckInterface<T extends object> = {
	[K in keyof T]: t.check<T[K]>;
};

export namespace t {
	export type check<T> = (value: unknown) => value is T;

	export type toType<T> = T extends t.check<infer U> ? U : never;

	export function defined(value: unknown): value is {} {
		if (value == null) {
			return false;
		}
		return true;
	}

	export function string(value: unknown): value is string {
		return t.defined(value) && typeof value === "string";
	}

	export function number(value: unknown): value is number {
		return t.defined(value) && typeof value === "number";
	}

	export function boolean(value: unknown): value is boolean {
		return t.defined(value) && typeof value === "boolean";
	}

	export function object(value: unknown): value is object {
		return t.defined(value) && typeof value === "object";
	}

	export function callback(value: unknown): value is Callback {
		return t.defined(value) && typeof value === "function";
	}

	export function objectRequired<T extends object>(
		initial: CheckInterface<T>,
	): t.check<T> {
		return (obj: unknown): obj is T => {
			if (!t.object(obj)) {
				return false;
			}
			for (const [key, value] of Object.entries(initial)) {
				if (!t.callback(value)) {
					return false;
				}
				const result = (value as t.check<unknown>)(
					obj[key as keyof typeof obj],
				);
				if (!t.boolean(result) || result === false) {
					return false;
				}
			}
			return true;
		};
	}
}
