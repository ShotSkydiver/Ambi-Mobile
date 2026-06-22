import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styled from 'styled-components';
import i18n from 'format-message';
import moment from 'moment';
import { useTheme } from '@react-navigation/native';

const AboutContainer = styled(View)``;
const SectionWrapper = styled(View)`
  margin-bottom: 24px;
`;

const SectionHeader = styled(Text)`
  font-family: Circular-Bold;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 8px;
  padding-left: 16px;
`;

const Section = styled(View)`
  padding: 16px;
  border-top-width: 0.5px;
  border-bottom-width: 0.5px;
`;

const SectionTitle = styled(Text)`
  font-family: Circular-Book;
  font-size: 13px;
  line-height: 15px;
  margin-bottom: 2px;
`;

const Info = styled(Text)`
  font-family: Circular-Book;
  font-size: 14px;
  line-height: 20px;
`;

const SpaceAbout = ({ spaceInfo, route }) => {
  const { description, isPrivate, isSecret, metadata, type } = spaceInfo;

  const isClass = type === 'class';
  const isRelatedSpace = route.params?.isRelatedSpace;
  const typeText = `${isRelatedSpace ? 'Related' : ''} ${type.replace(
    /^\w/,
    c => c.toUpperCase()
  )}`;
  const spaceTypeTitle = typeText.replace(/^\w/, c => c.toUpperCase());
  const { canvasStartAt, canvasEndAt } = metadata || {};
  const privacy = isPrivate ? 'Private' : isSecret ? 'Secret' : 'Public';

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  const styles = StyleSheet.create({
    sectionHeader: {
      color: themeColors.slateGray
    }
  });

  const hasBothDates = !!canvasStartAt && !!canvasEndAt;
  const hasNeitherDate = !canvasStartAt && !canvasEndAt;

  const datesText =
    hasBothDates || hasNeitherDate
      ? 'Dates'
      : `${canvasStartAt ? 'Start' : 'End'} Date`;
  const formattedStartDate = canvasStartAt
    ? moment(canvasStartAt).format(canvasEndAt ? 'MMM Do' : 'MMM Do, YYYY')
    : '';
  const formattedEndDate = canvasEndAt
    ? moment(canvasEndAt).format('MMM Do, YYYY')
    : '';

  return (
    <AboutContainer showsVerticalScrollIndicator={false}>
      {isClass && (
        <SectionWrapper>
          <SectionHeader style={styles.sectionHeader}>
            {i18n('Information')}
          </SectionHeader>
          <Section
            style={{
              backgroundColor: themeColors.elementBGColor,
              borderBottomColor: themeColors.systemBorderColor,
              borderTopColor: themeColors.systemBorderColor
            }}
          >
            <SectionTitle style={styles.sectionHeader}>
              {datesText}
            </SectionTitle>
            <Info style={{ color: themeColors.textPrimary }}>
              {hasNeitherDate
                ? 'The creator of this course has not yet specified a start or end date'
                : `${formattedStartDate} ${
                    hasBothDates ? ' - ' : ''
                  } ${formattedEndDate}`}
            </Info>
          </Section>
        </SectionWrapper>
      )}

      <SectionWrapper>
        <SectionHeader style={styles.sectionHeader}>
          {i18n('Description')}
        </SectionHeader>
        <Section
          style={{
            backgroundColor: themeColors.elementBGColor,
            borderBottomColor: themeColors.systemBorderColor,
            borderTopColor: themeColors.systemBorderColor
          }}
        >
          <Info style={{ color: themeColors.textPrimary }}>
            {description && description.length > 0
              ? description
              : i18n(
                  `Looks like there isn’t a description for this ${typeText} just yet. Once there is, it’ll appear here!`
                )}
          </Info>
        </Section>
      </SectionWrapper>

      {!isClass && (
        <SectionWrapper>
          <SectionHeader style={styles.sectionHeader}>
            {i18n(`${spaceTypeTitle} Privacy`)}
          </SectionHeader>
          <Section
            style={{
              backgroundColor: themeColors.elementBGColor,
              borderBottomColor: themeColors.systemBorderColor,
              borderTopColor: themeColors.systemBorderColor
            }}
          >
            <Info style={{ color: themeColors.textPrimary }}>
              {i18n('{privacy}', { privacy })}
            </Info>
          </Section>
        </SectionWrapper>
      )}
    </AboutContainer>
  );
};

export default SpaceAbout;
