import { type TypeParser, createTypeParserPreset } from 'slonik'
import { int8ToBigIntParser, timestamptzToDateParser } from './type-parsers'

/**
 * Return an opinionated set of type parsers including those from slonik's `createTypeParserPreset()`.
 * The return value is ready to be included in a slonik `ClientConfiguration`.
 */
export function getOpinionatedTypeParserPreset(): TypeParser[] {
  return [...createTypeParserPreset(), timestamptzToDateParser, int8ToBigIntParser]
}
