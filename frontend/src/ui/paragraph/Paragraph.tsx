import styled from "styled-components";

export const Paragraph = styled.p`
  font-size: 0.8rem;
`;

export const ParagraphItalic = styled(Paragraph)`
  font-style: italic;
`;

export const ParagraphItalicBold = styled(ParagraphItalic)`
  font-weight: 700;
`;
