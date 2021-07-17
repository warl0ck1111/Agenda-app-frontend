export class Agenda {

  id?: string;

  name?: string;

  title?: string;

  date?: string;

  details?: string;

  isCompleted?: boolean;

  time?: string;


  constructor(opts?: Partial<Agenda>) {
        if (opts?.id != null) {
            this.id = opts.id;
        }
        if (opts?.name != null) {
            this.name = opts.name;
        }
        if (opts?.title != null) {
            this.title = opts.title;
        }
        if (opts?.date != null) {
            this.date = opts.date;
        }
        if (opts?.details != null) {
            this.details = opts.details;
        }
        if (opts?.isCompleted != null) {
            this.isCompleted = opts.isCompleted;
        }
        if (opts?.time != null) {
            this.time = opts.time;
        }

    }

}
