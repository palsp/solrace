import React from "react";
import styled from "styled-components";
import {
  Filter as FilterIcon,
  ChevronsUp,
  Wind,
  CloudDrizzle,
  Feather,
} from "react-feather";
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
          <SmallDescription>
            Max Speed
            <IconWrapper style={{ "--size": 18 + "px" }}>
              <ChevronsUp />
            </IconWrapper>
          </SmallDescription>
          <DivCheckbox>
            <CheckboxDiv>
              <CheckboxInput type="checkbox" />
              <CheckboxLabel>
                <SmallDescription>1-19</SmallDescription>
              </CheckboxLabel>
            </CheckboxDiv>
            <CheckboxDiv>
              <CheckboxInput type="checkbox" />
              <CheckboxLabel>
                <SmallDescription>20-39</SmallDescription>
              </CheckboxLabel>
            </CheckboxDiv>
            <CheckboxDiv>
              <CheckboxInput type="checkbox" />
              <CheckboxLabel>
                <SmallDescription>40-59</SmallDescription>
              </CheckboxLabel>
            </CheckboxDiv>
            <CheckboxDiv>
              <CheckboxInput type="checkbox" />
              <CheckboxLabel>
                <SmallDescription>60-79</SmallDescription>
              </CheckboxLabel>
            </CheckboxDiv>
            <CheckboxDiv>
              <CheckboxInput type="checkbox" />
              <CheckboxLabel>
                <SmallDescription>80-99</SmallDescription>
              </CheckboxLabel>
            </CheckboxDiv>
          </DivCheckbox>
          <div>
            <SmallDescription>
              Acceleration
              <IconWrapper style={{ "--size": 18 + "px" }}>
                <Wind />
              </IconWrapper>
            </SmallDescription>
            <DivCheckbox>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>1-19</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>20-39</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>40-59</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>60-79</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>80-99</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>{" "}
            </DivCheckbox>
          </div>
          <div>
            <SmallDescription>
              Drift
              <IconWrapper style={{ "--size": 18 + "px" }}>
                <CloudDrizzle />
              </IconWrapper>
            </SmallDescription>
            <DivCheckbox>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>1-19</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>20-39</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>40-59</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>60-79</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>80-99</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
            </DivCheckbox>
          </div>
          <div>
            <SmallDescription>
              Handling
              <IconWrapper style={{ "--size": 18 + "px" }}>
                <Feather />
              </IconWrapper>
            </SmallDescription>
            <DivCheckbox>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>1-19</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>20-39</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>40-59</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>60-79</SmallDescription>
                </CheckboxLabel>
              </CheckboxDiv>
              <CheckboxDiv>
                <CheckboxInput type="checkbox" />
                <CheckboxLabel>
                  <SmallDescription>80-99</SmallDescription>
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
const WrapperRarity = styled.div`
  margin: 1rem 0;
`;
const WrapperAbility = styled.div`
  margin: 1rem 0;
`;
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
    min-width: 40px;
  }
`;

const AbilityDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem 1rem;
`;

const DivCheckbox = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CheckboxInput = styled.input``;
const CheckboxLabel = styled.label``;
const SmallDescription = styled.p`
  font-size: 0.7rem;
`;
const IconWrapper = styled.div`
  display: inline-block;
  width: var(--size);
  height: var(--size);
  margin: 0 0.2rem;
  pointer-events: none;
`;
export default Filter;
