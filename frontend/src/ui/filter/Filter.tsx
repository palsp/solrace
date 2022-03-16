import React from "react";
import styled from "styled-components";
import { Filter as FilterIcon } from "react-feather";
const Filter = () => {
  return (
    <WrapperFilter>
      <TitleDiv>
        <FilterDiv>
          <FilterIcon />
          <h3>Filter</h3>
        </FilterDiv>
        <ApplyDiv>
          <p>Apply</p>
          <p>Clear</p>
        </ApplyDiv>
      </TitleDiv>
      <WrapperRarity>
        <p>Rarity</p>
        <RarityDiv>
          <div>C</div>
          <div>CS</div>
          <div>B</div>
          <div>BS</div>
          <div>A</div>
          <div>AS</div>
          <div>S</div>
          <div>SS</div>
        </RarityDiv>
      </WrapperRarity>
      <WrapperAbility>
        <p>Ability</p>
        <AbilityDiv>
          <div>Max Speed</div>
          <div>Acceleration</div>
          <div>Drift</div>
          <div>Handling</div>
        </AbilityDiv>
      </WrapperAbility>
    </WrapperFilter>
  );
};

const WrapperFilter = styled.div`
  background: var(--color-white);
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: var(--shadow-elevation-medium-secondary);
`;
const WrapperRarity = styled.div``;
const WrapperAbility = styled.div``;
const TitleDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;
const FilterDiv = styled.div`
  display: flex;
`;
const ApplyDiv = styled.div`
  display: flex;
`;
const RarityDiv = styled.div`
  display: flex;
  gap: 1rem;
`;
const AbilityDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
export default Filter;
