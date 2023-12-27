import { FormatterOptionsArgs, Row, writeToStream } from '@fast-csv/format';
import * as fs from 'fs';
import * as path from 'path';
import { getDate } from "./datetime";

type CsvFileOpts = {
  headers: string[];
  path: string;
};

class CsvFile {
//https://c2fo.github.io/fast-csv/docs/formatting/examples/#appending-to-a-csv
static write(stream: NodeJS.WritableStream, rows: Row[], options: FormatterOptionsArgs<Row, Row>): Promise<void> {
    return new Promise((res, rej) => {
        writeToStream(stream, rows, options)
            .on('error', (err: Error) => rej(err))
            .on('finish', () => res());
    });
  }

  private readonly headers: string[];
  private readonly path: string;
  private readonly writeOpts: FormatterOptionsArgs<Row, Row>;
  constructor(opts: CsvFileOpts) {
      this.headers = opts.headers;
      this.path = opts.path;
      this.writeOpts = { includeEndRowDelimiter: true };
  }

  update(rows: Row[]): Promise<void> {
      return CsvFile.write(fs.createWriteStream(this.path,  { flags: 'a' }), rows, { ...this.writeOpts });
  }

  append(rows: Row[]): Promise<void> {
      return CsvFile.write(fs.createWriteStream(this.path, { flags: 'a' }), rows, {
          ...this.writeOpts,
          // dont write the headers when appending
          writeHeaders: false,
      } as FormatterOptionsArgs<Row, Row>);
  }

  read(): Promise<Buffer> {
      return new Promise((res, rej) => {
          fs.readFile(this.path, (err, contents) => {
              if (err) {
                  return rej(err);
              }
              return res(contents);
          });
      });
  }
}
  
export function appendResultsToCsv(prompt, url, descriptions, durations, mediaSelected, mediaIDs){
    const csvFile = new CsvFile({
    path: path.resolve(__dirname+'/../reports/', 'generated_designs_data '+getDate("yyyy-MM")+'.csv'),
    // headers to write 
    headers: ['RunDate', 'PropmtUsed', 'Output', "Durations", 'DesignURL', 'MediaSelected', 'MediaIDs'],
  });
  
  csvFile
    .update([
      { Date: getDate("yyyy-MM-dd HH:mm"), PropmtUsed: prompt, Output: descriptions, 
      PageDurations: durations, DesignURL: url, MediaSelected: mediaSelected, 
      MediaIDs: mediaIDs} 
    ])
    .catch(err => {
      console.error(err.stack);
      process.exit(1);
    });
  }
  