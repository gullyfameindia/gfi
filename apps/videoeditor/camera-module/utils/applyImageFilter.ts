import { FilterConfig } from '../types/filters';
















export async function applyImageFilter(
  uri: string,
  filter: FilterConfig
): Promise<string> {
  
  if (filter.name === 'Original') {
    return uri;
  }

  
  
  

  
  
  
  
  
  return uri;
}
