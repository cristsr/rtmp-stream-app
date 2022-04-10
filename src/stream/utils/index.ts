import { catchError, Observable, throwError } from 'rxjs';
import { PathLike, watch as _watch, WatchOptions } from 'fs';

type Events = 'change' | 'rename';

class WatchEvent<T = string | Buffer, E extends Events = Events> {
  constructor(public readonly event: E, public readonly filename: T) {}
}

export class WatchError<T extends PathLike> extends Error {
  constructor(public readonly path: T, public readonly error: Error) {
    super(`Error watching ${path}`);
  }
}

export function watch(
  path: PathLike,
  options: WatchOptions,
): Observable<WatchEvent> {
  return new Observable((observer) => {
    const watcher = _watch(
      path,
      options as WatchOptions,
      (eventType, filename: string | Buffer) => {
        observer.next(new WatchEvent(eventType, filename));
      },
    );

    watcher.once('error', (error) =>
      observer.error(new WatchError(path, error)),
    );

    // Register event listeners
    watcher.once('close', () => {
      observer.complete();
    });

    return () => {
      watcher.removeAllListeners();
      watcher.close();
    };
  });
}

export function extractKeyFromPath(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1];
}

export function formatError() {
  return (source) => {
    return source.pipe(
      catchError((e) => throwError(e?.response?.data || e.message)),
    );
  };
}
