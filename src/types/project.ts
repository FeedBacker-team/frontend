// File도 그대로 들어간다. 수정 화면의 기존 이미지는 File이 아니라 서버가 준 정보다.
export type ProjectImageValue = Pick<File, 'name' | 'type' | 'size'>;

export interface ProjectFormValues {
  title: string;
  description: string;
  tags: string[];
  image: ProjectImageValue | null;
  url: string;
}

export type ProjectFormErrors = Record<
  Exclude<keyof ProjectFormValues, 'tags'>,
  boolean
>;
