import React from "react";
import styled from "styled-components";
import { Filter as FilterIcon } from "react-feather";
import Button from "../button";
const Filter = () => {
  return (
    <WrapperFilter>
      <TitleDiv>
        <FilterDiv>
          <WrapperIcon>
            <FilterIcon />
          </WrapperIcon>
          <h3>Filter</h3>
        </FilterDiv>
        <ApplyDiv>
          <Button color="secondary" padding="0.25rem 0.4rem">
            Apply
          </Button>
          <Button color="secondary" padding="0.25rem 0.4rem">
            Clear
          </Button>
        </ApplyDiv>
      </TitleDiv>
      <WrapperRarity>
        <p>Rarity</p>
        <RarityDiv>
          <CheckboxDiv>
            <CheckboxInput type="checkbox" />
            <CheckboxLabel>
              <SmallDescription>C</SmallDescription>
            </CheckboxLabel>
          </CheckboxDiv>

          <CheckboxDiv>
            <CheckboxInput type="checkbox" />
            <CheckboxLabel>
              <SmallDescription>CS</SmallDescription>
            </CheckboxLabel>
          </CheckboxDiv>
          <CheckboxDiv>
            <CheckboxInput type="checkbox" />
            <CheckboxLabel>
              <SmallDescription>B</SmallDescription>
            </CheckboxLabel>
          </CheckboxDiv>
          <CheckboxDiv>
            <CheckboxInput type="checkbox" />
            <CheckboxLabel>
              <SmallDescription>BS</SmallDescription>
            </CheckboxLabel>
          </CheckboxDiv>
          <CheckboxDiv>
            <CheckboxInput type="checkbox" />
            <CheckboxLabel>
              <SmallDescription>A</SmallDescription>
            </CheckboxLabel>
          </CheckboxDiv>
          <CheckboxDiv>
            <CheckboxInput type="checkbox" />
            <CheckboxLabel>
              <SmallDescription>AS</SmallDescription>
            </CheckboxLabel>
          </CheckboxDiv>
          <CheckboxDiv>
            <CheckboxInput type="checkbox" />
            <CheckboxLabel>
              <SmallDescription>S</SmallDescription>
            </CheckboxLabel>
          </CheckboxDiv>
          <CheckboxDiv>
            <CheckboxInput type="checkbox" />
            <CheckboxLabel>
              <SmallDescription>SS</SmallDescription>
            </CheckboxLabel>
          </CheckboxDiv>
        </RarityDiv>
      </WrapperRarity>
      <WrapperAbility>
        <p>Ability</p>
        <AbilityDiv>
          <SmallDescription>Max Speed</SmallDescription>
          <DivCheckbox>
            <CheckboxDiv>
              <CheckboxInput type="checkbox" />
              <CheckboxLabel>
                <SmallDescription>1</SmallDescription>
              </CheckboxLabel>
            </CheckboxDiv>
            <CheckboxDiv>
              <CheckboxInput type="checkbox" />
              <CheckboxLabel>
                <SmallDescription>2</SmallDescription>
              </CheckboxLabel>
            </CheckboxDiv>
            <CheckboxDiv>
              <CheckboxInput type="checkbox" />
              <CheckboxLabel>
                <SmallDescription>3</SmallDescription>
              </CheckboxLabel>
            </CheckboxDiv>
            <CheckboxDiv>
              <CheckboxInput type="checkbox" />
              <CheckboxLabel>
                <SmallDescription>4</SmallDescription>
              </CheckboxLabel>
            </CheckboxDiv>
            <CheckboxDiv>
              <CheckboxInput type="checkbox" />
              <CheckboxLabel>
                <SmallDescription>5</SmallDescription>
              </CheckboxLabel>
            </CheckboxDiv>
          </DivCheckbox>
          <div>
            <SmallDescription>Acceleration</SmallDescription>
            <DivCheckbox>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>1</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>2</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>3</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>4</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>5</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
            </DivCheckbox>
          </div>
          <div>
            <SmallDescription>Drift</SmallDescription>
            <DivCheckbox>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>1</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>2</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>3</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>4</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>5</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
            </DivCheckbox>
          </div>
          <div>
            <SmallDescription>Handling</SmallDescription>
            <DivCheckbox>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>1</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>2</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>3</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>4</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>5</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
            </DivCheckbox>
          </div>
        </AbilityDiv>
      </WrapperAbility>
    </WrapperFilter>
  );
};

const WrapperFilter = styled.form`
  background: var(--color-white);
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: var(--shadow-elevation-medium-secondary);
`;
const WrapperRarity = styled.div``;
const WrapperAbility = styled.div``;
const WrapperIcon = styled.div`
  display: inline-block;
  width: var(--size);
  height: var(--size);
  margin: 0.25rem 0.2rem;
  pointer-events: none;
`;

const TitleDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const FilterDiv = styled.div`
  display: flex;
`;
const ApplyDiv = styled.div`
  display: flex;
  gap: 0.4rem;
`;
const CheckboxDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const RarityDiv = styled.div`
  display: flex;
  gap: 0 2rem;
  flex-wrap: wrap;
  & > ${CheckboxDiv} {
    min-width: 30px;
  }
`;

const AbilityDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem 1rem;
`;

const DivCheckbox = styled.div`
  display: flex;
  gap: 1rem;
`;

const CheckboxInput = styled.input``;
const CheckboxLabel = styled.label``;
const SmallDescription = styled.p`
  font-size: 0.7rem;
`;
export default Filter;
